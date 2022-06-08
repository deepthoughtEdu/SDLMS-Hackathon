'use strict';

const winston = require('winston');

const groups = require('../../groups');
const user = require('../../user');
const categories = require('../../categories');
const privileges = require('../../privileges');
const plugins = require('../../plugins');
const events = require('../../events');
const api = require('../../api');
const sockets = require('..');

const Categories = module.exports;

Categories.create = async function (socket, data) {
	sockets.warnDeprecated(socket, 'POST /api/v3/categories');

	if (!data) {
		throw new Error('[[error:invalid-data]]');
	}
	return await api.categories.create(socket, data);
};

// DEPRECATED: @1.14.3, remove in version >=1.16
Categories.getAll = async function () {
	winston.warn('[deprecated] admin.categories.getAll deprecated, data is returned in the api route');
	const cids = await categories.getAllCidsFromSet('categories:cid');
	const fields = [
		'cid', 'name', 'icon', 'parentCid', 'disabled', 'link',
		'color', 'bgColor', 'backgroundImage', 'imageClass',
	];
	const categoriesData = await categories.getCategoriesFields(cids, fields);
	const result = await plugins.hooks.fire('filter:admin.categories.get', { categories: categoriesData, fields: fields });
	return categories.getTree(result.categories, 0);
};

Categories.getNames = async function () {
	return await categories.getAllCategoryFields(['cid', 'name']);
};

Categories.purge = async function (socket, cid) {
	sockets.warnDeprecated(socket, 'DELETE /api/v3/categories/:cid');

	await api.categories.delete(socket, { cid: cid });
};

Categories.update = async function (socket, data) {
	sockets.warnDeprecated(socket, 'PUT /api/v3/categories/:cid');

	if (!data) {
		throw new Error('[[error:invalid-data]]');
	}
	return await api.categories.update(socket, data);
};

Categories.setPrivilege = async function (socket, data) {
	if (!data) {
		throw new Error('[[error:invalid-data]]');
	}
	const [userExists, groupExists] = await Promise.all([
		user.exists(data.member),
		groups.exists(data.member),
	]);

	if (!userExists && !groupExists) {
		throw new Error('[[error:no-user-or-group]]');
	}

	await privileges.categories[data.set ? 'give' : 'rescind'](
		Array.isArray(data.privilege) ? data.privilege : [data.privilege], data.cid, data.member
	);

	await events.log({
		uid: socket.uid,
		type: 'privilege-change',
		ip: socket.ip,
		privilege: data.privilege.toString(),
		cid: data.cid,
		action: data.set ? 'grant' : 'rescind',
		target: data.member,
	});
};

Categories.getPrivilegeSettings = async function (socket, cid) {
	if (cid === 'admin') {
		return await privileges.admin.list(socket.uid);
	} else if (!parseInt(cid, 10)) {
		return await privileges.global.list();
	}
	return await privileges.categories.list(cid);
};

Categories.copyPrivilegesToChildren = async function (socket, data) {
	const result = await categories.getChildren([data.cid], socket.uid);
	const children = result[0];
	for (const child of children) {
		// eslint-disable-next-line no-await-in-loop
		await copyPrivilegesToChildrenRecursive(data.cid, child, data.group);
	}
};

async function copyPrivilegesToChildrenRecursive(parentCid, category, group) {
	await categories.copyPrivilegesFrom(parentCid, category.cid, group);
	for (const child of category.children) {
		// eslint-disable-next-line no-await-in-loop
		await copyPrivilegesToChildrenRecursive(parentCid, child, group);
	}
}

Categories.copySettingsFrom = async function (socket, data) {
	return await categories.copySettingsFrom(data.fromCid, data.toCid, data.copyParent);
};

Categories.copyPrivilegesFrom = async function (socket, data) {
	await categories.copyPrivilegesFrom(data.fromCid, data.toCid, data.group);
};

Categories.copyPrivilegesToAllCategories = async function (socket, data) {
	let cids = await categories.getAllCidsFromSet('categories:cid');
	cids = cids.filter(cid => parseInt(cid, 10) !== parseInt(data.cid, 10));
	for (const toCid of cids) {
		// eslint-disable-next-line no-await-in-loop
		await categories.copyPrivilegesFrom(data.cid, toCid, data.group);
	}
};
