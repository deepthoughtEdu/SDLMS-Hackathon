'use strict';

const winston = require('winston');
const nconf = require('nconf');
const fs = require('fs');
const util = require('util');
const path = require('path');
const rimraf = require('rimraf');
const rimrafAsync = util.promisify(rimraf);

const plugins = require('../plugins');
const db = require('../database');
const file = require('../file');
const minifier = require('./minifier');

const CSS = module.exports;

CSS.supportedSkins = [
	'cerulean', 'cyborg', 'flatly', 'journal', 'lumen', 'paper', 'simplex',
	'spacelab', 'united', 'cosmo', 'darkly', 'readable', 'sandstone',
	'slate', 'superhero', 'yeti',
];

const buildImports = {
	client: function (source) {
		return source + '\n' + [
			'@import "../../public/less/sdlms";',
		].map(function (str) {
			return str.replace(/\//g, path.sep);
		}).join('\n');
	},
	admin: function (source) {
		return source + '\n' + [
			'@import "font-awesome";',
			'@import "../public/less/admin/admin";',
			'@import "../public/less/generics.less";',
			'@import "../../public/less/jquery-ui.less";',
			'@import (inline) "../node_modules/@adactive/bootstrap-tagsinput/src/bootstrap-tagsinput.css";',
			'@import (inline) "../public/vendor/mdl/material.css";',

		].map(function (str) {
			return str.replace(/\//g, path.sep);
		}).join('\n');
	},
};

async function filterMissingFiles(filepaths) {
	const exists = await Promise.all(
		filepaths.map(async (filepath) => {
			const exists = await file.exists(path.join(__dirname, '../../node_modules', filepath));
			if (!exists) {
				winston.warn('[meta/css] File not found! ' + filepath);
			}
			return exists;
		})
	);
	return filepaths.filter((filePath, i) => exists[i]);
}

async function getImports(files, prefix, extension) {
	const pluginDirectories = [];
	let source = '';

	files.forEach(function (styleFile) {
		if (styleFile.endsWith(extension)) {
			source += prefix + path.sep + styleFile + '";';
		} else {
			pluginDirectories.push(styleFile);
		}
	});
	await Promise.all(pluginDirectories.map(async function (directory) {
		const styleFiles = await file.walk(directory);
		styleFiles.forEach(function (styleFile) {
			source += prefix + path.sep + styleFile + '";';
		});
	}));
	return source;
}

async function getBundleMetadata(target) {
	const paths = [
		path.join(__dirname, '../../node_modules'),
		path.join(__dirname, '../../public/less'),
		path.join(__dirname, '../../public/vendor/fontawesome/less'),
	];

	// Skin support
	let skin;
	if (target.startsWith('client-')) {
		skin = target.split('-')[1];

		if (CSS.supportedSkins.includes(skin)) {
			target = 'client';
		}
	}
	let skinImport = [];
	if (target === 'client') {
		// const themeData = await db.getObjectFields('config', ['theme:type', 'theme:id', 'bootswatchSkin']);
		// const themeId = (themeData['theme:id'] || 'nodebb-theme-persona');
		// const baseThemePath = path.join(nconf.get('themes_path'), (themeData['theme:type'] && themeData['theme:type'] === 'local' ? themeId : 'nodebb-theme-vanilla'));
		// paths.unshift(baseThemePath);

		// themeData.bootswatchSkin = skin || themeData.bootswatchSkin;
		// if (themeData && themeData.bootswatchSkin) {
		// 	skinImport.push('\n@import "./@nodebb/bootswatch/' + themeData.bootswatchSkin + '/variables.less";');
		// 	skinImport.push('\n@import "./@nodebb/bootswatch/' + themeData.bootswatchSkin + '/bootswatch.less";');
		// }
		// skinImport = skinImport.join('');
	}

	const [lessImports, cssImports, acpLessImports] = await Promise.all([
		target === 'client' ? '' : moo(plugins.lessFiles, '\n@import ".', '.less'),
		target === 'client' ? '' : moo(plugins.cssFiles, '\n@import (inline) ".', '.css'),
		target === 'client' ? '' : moo(plugins.acpLessFiles, '\n@import ".', '.less'),
	]);

	async function moo(files, prefix, extension) {
		const filteredFiles = await filterMissingFiles(files);
		return await getImports(filteredFiles, prefix, extension);
	}

	let imports = skinImport + '\n' + cssImports + '\n' + lessImports + '\n' + acpLessImports;
	imports = buildImports[target](imports);

	return { paths: paths, imports: imports };
}
/**
 * @author Deepansu
 * @date   06-02-2021
 * @description This function is used to compile the custom css/less files
 * 				to avoid the need of theme css/less files .. you can still use @function getBundleMetadata to get the paths and imports
 * */
async function getCustomClientCss() {

	const imports = [
		'@import "../../public/css/helper.css";',
		'@import "../../public/css/styles.css";',
		'@import "../../public/css/feedbacks.css";',
		'@import "../../public/css/responsive.css";'

	].map(function (str) {
		return str.replace(/\//g, path.sep);
	}).join('\n');

	const paths = [
		path.join(__dirname, '../../public/css/sdlms')
	]
	return {
		imports: imports,
		paths: paths
	};
}
CSS.buildBundle = async function (target, fork) {
	var data;
	var filename = target + '.css';
	if (target === 'client') {
		filename = 'styles.css'
		await rimrafAsync(path.join(__dirname, '../../build/public/styles*'));
	}
	data = await getBundleMetadata(target);
	const minify = process.env.NODE_ENV !== 'development';
	const bundle = await minifier.css.bundle(data.imports, data.paths, minify, fork);
	await fs.promises.writeFile(path.join(__dirname, '../../build/public', filename), bundle.code);
	return bundle.code;
};
