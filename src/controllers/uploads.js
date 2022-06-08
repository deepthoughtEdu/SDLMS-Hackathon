'use strict';

const path = require('path');
const nconf = require('nconf');
const validator = require('validator');

const db = require('../database');
const meta = require('../meta');
const file = require('../file');
const plugins = require('../plugins');
const image = require('../image');
const privileges = require('../privileges');

const helpers = require('./helpers');
const winston = require('winston');
const { json } = require('body-parser');

const uploadsController = module.exports;

uploadsController.upload = async function (req, res, filesIterator) {
	let files;
	try {
		files = req.files.files;
	} catch (e) {
		return helpers.formatApiResponse(400, res);
	}

	// TODO: Remove this (and the usages of isV2 below) in v1.17.0
	const isV2 = req.originalUrl === `${nconf.get('relative_path')}/api/v2/util/upload`;

	// These checks added because of odd behaviour by request: https://github.com/request/request/issues/2445
	if (!Array.isArray(files)) {
		return isV2 ? res.status(500).json('invalid files') : helpers.formatApiResponse(500, res, new Error('[[error:invalid-file]]'));
	}
	if (Array.isArray(files[0])) {
		files = files[0];
	}

	try {
		const images = [];
		for (const fileObj of files) {
			/* eslint-disable no-await-in-loop */
			images.push(await filesIterator(fileObj));
		}

		if (isV2) {
			res.status(200).json(images);
		} else {
			helpers.formatApiResponse(200, res, { images });
		}

		return images;
	} catch (err) {
		if (isV2) {
			res.status(500).json({ path: req.path, error: err.message });
		} else {
			return helpers.formatApiResponse(500, res, err);
		}
	} finally {
		deleteTempFiles(files);
	}
};

uploadsController.uploadPost = async function (req, res) {
	await uploadsController.upload(req, res, async function (uploadedFile) {
		const isImage = uploadedFile.type.match(/image./);
		if (isImage) {
			return await uploadAsImage(req, uploadedFile);
		}
		return await uploadAsFile(req, uploadedFile);
	});
};

async function uploadAsImage(req, uploadedFile) {
	const canUpload = await privileges.global.can('upload:post:image', req.uid);
	if (!canUpload) {
		throw new Error('[[error:no-privileges]]');
	}
	await image.checkDimensions(uploadedFile.path);
	await image.stripEXIF(uploadedFile.path);

	if (plugins.hooks.hasListeners('filter:uploadImage')) {
		return await plugins.hooks.fire('filter:uploadImage', {
			image: uploadedFile,
			uid: req.uid,
			folder: 'files',
		});
	}
	await image.isFileTypeAllowed(uploadedFile.path);

	let fileObj = await uploadsController.uploadFile(req.uid, uploadedFile);
	// sharp can't save svgs skip resize for them
	const isSVG = uploadedFile.type === 'image/svg+xml';
	if (isSVG || meta.config.resizeImageWidth === 0 || meta.config.resizeImageWidthThreshold === 0) {
		return fileObj;
	}

	fileObj = await resizeImage(fileObj);
	return { url: fileObj.url };
}

async function uploadAsFile(req, uploadedFile) {
	const canUpload = await privileges.global.can('upload:post:file', req.uid);
	if (!canUpload) {
		throw new Error('[[error:no-privileges]]');
	}

	const fileObj = await uploadsController.uploadFile(req.uid, uploadedFile);
	return {
		url: fileObj.url,
		name: fileObj.name,
	};
}

async function resizeImage(fileObj) {
	const imageData = await image.size(fileObj.path);
	if (imageData.width < meta.config.resizeImageWidthThreshold || meta.config.resizeImageWidth > meta.config.resizeImageWidthThreshold) {
		return fileObj;
	}

	await image.resizeImage({
		path: fileObj.path,
		target: file.appendToFileName(fileObj.path, '-resized'),
		width: meta.config.resizeImageWidth,
		quality: meta.config.resizeImageQuality,
	});
	// Return the resized version to the composer/postData
	fileObj.url = file.appendToFileName(fileObj.url, '-resized');

	return fileObj;
}

uploadsController.uploadThumb = async function (req, res) {
	if (!meta.config.allowTopicsThumbnail) {
		deleteTempFiles(req.files.files);
		return helpers.formatApiResponse(503, res, new Error('[[error:topic-thumbnails-are-disabled]]'));
	}

	return await uploadsController.upload(req, res, async function (uploadedFile) {
		if (!uploadedFile.type.match(/image./)) {
			throw new Error('[[error:invalid-file]]');
		}
		await image.isFileTypeAllowed(uploadedFile.path);
		const dimensions = await image.checkDimensions(uploadedFile.path);

		if (dimensions.width > parseInt(meta.config.topicThumbSize, 10)) {
			await image.resizeImage({
				path: uploadedFile.path,
				width: meta.config.topicThumbSize,
			});
		}
		if (plugins.hooks.hasListeners('filter:uploadImage')) {
			return await plugins.hooks.fire('filter:uploadImage', {
				image: uploadedFile,
				uid: req.uid,
				folder: 'files',
			});
		}

		return await uploadsController.uploadFile(req.uid, uploadedFile);
	});
};

uploadsController.uploadFile = async function (uid, uploadedFile) {
	var payload = {
		file: uploadedFile,
		uid: uid,
		folder: 'others',
	}
	if (uploadedFile.type.includes('audio')) {
		payload.folder = 'sounds';
	}
	else if (uploadedFile.type.includes('image')) {
		payload.folder = 'images';
	}
	else if (uploadedFile.type.includes('video')) {
		payload.folder = 'videos';
	}
	else if (uploadedFile.type.includes('pdf') || uploadedFile.type.includes('text') || uploadedFile.type.includes('office')) {
		payload.folder = 'documents';
	}

	if (plugins.hooks.hasListeners('filter:uploadFile')) {
		return await plugins.hooks.fire('filter:uploadFile', { payload });
	}

	if (!uploadedFile) {
		throw new Error('[[error:invalid-file]]');
	}

	if (uploadedFile.size > meta.config.maximumFileSize * 1024) {
		throw new Error('[[error:file-too-big, ' + meta.config.maximumFileSize + ']]');
	}

	const allowed = file.allowedExtensions();

	const extension = path.extname(uploadedFile.name).toLowerCase();
	if (allowed.length > 0 && (!extension || extension === '.' || !allowed.includes(extension))) {
		throw new Error('[[error:invalid-file-type, ' + allowed.join('&#44; ') + ']]');
	}

	return await saveFileToLocal(uid, payload.folder, uploadedFile);
};

async function saveFileToLocal(uid, folder, uploadedFile) {
	const name = uploadedFile.name || 'upload';
	const extension = path.extname(name) || '';

	const filename = Date.now() + '-' + validator.escape(name.substr(0, name.length - extension.length)).substr(0, 255) + extension;

	const upload = await file.saveFileToLocal(filename, folder, uploadedFile.path);
	const storedFile = {
		url: nconf.get('relative_path') + upload.url,
		path: upload.path,
		name: uploadedFile.name,
	};
	const fileKey = upload.url.replace(nconf.get('upload_url'), '');
	await db.sortedSetAdd('uid:' + uid + ':uploads', Date.now(), fileKey);
	const data = await plugins.hooks.fire('filter:uploadStored', { uid: uid, uploadedFile: uploadedFile, storedFile: storedFile });
	return data.storedFile;
}

function deleteTempFiles(files) {
	files.forEach(fileObj => file.delete(fileObj.path));
}

require('../promisify')(uploadsController, ['upload', 'uploadPost', 'uploadThumb']);
