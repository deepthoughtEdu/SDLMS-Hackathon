
'use strict';

const _ = require('lodash');

const user = require('../user');
const groups = require('../groups');
const helpers = require('./helpers');
const plugins = require('../plugins');
const utils = require('../utils');

module.exports = function (privileges) {
	privileges.admin = {};

	privileges.admin.privilegeLabels = [
		{ name: '[[admin/manage/privileges:admin-dashboard]]' },
		{ name: '[[admin/manage/privileges:admin-categories]]' },
		{ name: '[[admin/manage/privileges:admin-privileges]]' },
		{ name: '[[admin/manage/privileges:admin-admins-mods]]' },
		{ name: '[[admin/manage/privileges:admin-users]]' },
		{ name: '[[admin/manage/privileges:admin-groups]]' },
		{ name: '[[admin/manage/privileges:admin-tags]]' },
		{ name: '[[admin/manage/privileges:admin-settings]]' },
		{ name: '[[admin/manage/privileges:anecdotes]]' },


	];

	privileges.admin.userPrivilegeList = [
		'admin:dashboard',
		'admin:categories',
		'admin:anecdotes',
		'admin:privileges',
		'admin:admins-mods',
		'admin:users',
		'admin:groups',
		'admin:tags',
		'admin:settings',
		
	];

	privileges.admin.groupPrivilegeList = privileges.admin.userPrivilegeList.map(privilege => 'groups:' + privilege);

	// Mapping for a page route (via direct match or regexp) to a privilege
	privileges.admin.routeMap = {
		dashboard: 'admin:dashboard',
		'manage/categories': 'admin:categories',
		'manage/privileges': 'admin:privileges',
		'manage/admins-mods': 'admin:admins-mods',
		'manage/users': 'admin:users',
		'manage/groups': 'admin:groups',
		'manage/tags': 'admin:tags',
		'settings/tags': 'admin:tags',
		'extend/plugins': 'admin:settings',
		'extend/widgets': 'admin:settings',
		'extend/rewards': 'admin:settings',
	};
	privileges.admin.routeRegexpMap = {
		'^manage/categories/\\d+': 'admin:categories',
		'^manage/privileges/(\\d+|admin)': 'admin:privileges',
		'^manage/groups/.+$': 'admin:groups',
		'^settings/[\\w\\-]+$': 'admin:settings',
		'^appearance/[\\w]+$': 'admin:settings',
		'^plugins/[\\w\\-]+$': 'admin:settings',
	};

	// Mapping for socket call methods to a privilege
	// In NodeBB v2, these socket calls will be removed in favour of xhr calls
	privileges.admin.socketMap = {
		'admin.rooms.getAll': 'admin:dashboard',
		'admin.analytics.get': 'admin:dashboard',

		'admin.categories.getAll': 'admin:categories',
		'admin.categories.create': 'admin:categories',
		'admin.categories.update': 'admin:categories',
		'admin.categories.purge': 'admin:categories',
		'admin.categories.copySettingsFrom': 'admin:categories',

		'admin.categories.getPrivilegeSettings': 'admin:privileges',
		'admin.categories.setPrivilege': 'admin:privileges;admin:admins-mods',
		'admin.categories.copyPrivilegesToChildren': 'admin:privileges',
		'admin.categories.copyPrivilegesFrom': 'admin:privileges',
		'admin.categories.copyPrivilegesToAllCategories': 'admin:privileges',

		'admin.user.makeAdmins': 'admin:admins-mods',
		'admin.user.removeAdmins': 'admin:admins-mods',

		'admin.user.loadGroups': 'admin:users',
		'admin.groups.join': 'admin:users',
		'admin.groups.leave': 'admin:users',
		'admin.user.resetLockouts': 'admin:users',
		'admin.user.validateEmail': 'admin:users',
		'admin.user.sendValidationEmail': 'admin:users',
		'admin.user.sendPasswordResetEmail': 'admin:users',
		'admin.user.forcePasswordReset': 'admin:users',
		'admin.user.deleteUsers': 'admin:users',
		'admin.user.deleteUsersAndContent': 'admin:users',
		'admin.user.createUser': 'admin:users',
		'admin.user.invite': 'admin:users',

		'admin.tags.create': 'admin:tags',
		'admin.tags.update': 'admin:tags',
		'admin.tags.rename': 'admin:tags',
		'admin.tags.deleteTags': 'admin:tags',

		'admin.getSearchDict': 'admin:settings',
		'admin.config.setMultiple': 'admin:settings',
		'admin.config.remove': 'admin:settings',
		'admin.themes.getInstalled': 'admin:settings',
		'admin.themes.set': 'admin:settings',
		'admin.reloadAllSessions': 'admin:settings',
		'admin.settings.get': 'admin:settings',
		'admin.settings.set': 'admin:settings',
	};

	privileges.admin.resolve = (path) => {
		if (privileges.admin.routeMap[path]) {
			return privileges.admin.routeMap[path];
		}

		let privilege;
		Object.keys(privileges.admin.routeRegexpMap).forEach((regexp) => {
			if (!privilege) {
				if (new RegExp(regexp).test(path)) {
					privilege = privileges.admin.routeRegexpMap[regexp];
				}
			}
		});

		return privilege;
	};

	privileges.admin.list = async function (uid) {
		const privilegeLabels = privileges.admin.privilegeLabels.slice();
		const userPrivilegeList = privileges.admin.userPrivilegeList.slice();
		const groupPrivilegeList = privileges.admin.groupPrivilegeList.slice();

		// Restrict privileges column to superadmins
		if (!(await user.isAdministrator(uid))) {
			const idx = privileges.admin.userPrivilegeList.indexOf('admin:privileges');
			privilegeLabels.splice(idx, 1);
			userPrivilegeList.splice(idx, 1);
			groupPrivilegeList.splice(idx, 1);
		}

		async function getLabels() {
			return await utils.promiseParallel({
				users: plugins.hooks.fire('filter:privileges.admin.list_human', privilegeLabels.slice()),
				groups: plugins.hooks.fire('filter:privileges.admin.groups.list_human', privilegeLabels.slice()),
			});
		}

		const keys = await utils.promiseParallel({
			users: plugins.hooks.fire('filter:privileges.admin.list', userPrivilegeList.slice()),
			groups: plugins.hooks.fire('filter:privileges.admin.groups.list', groupPrivilegeList.slice()),
		});

		const payload = await utils.promiseParallel({
			labels: getLabels(),
			users: helpers.getUserPrivileges(0, keys.users),
			groups: helpers.getGroupPrivileges(0, keys.groups),
		});
		payload.keys = keys;

		// This is a hack because I can't do {labels.users.length} to echo the count in templates.js
		payload.columnCount = payload.labels.users.length + 3;
		return payload;
	};

	privileges.admin.get = async function (uid) {
		const [userPrivileges, isAdministrator] = await Promise.all([
			helpers.isAllowedTo(privileges.admin.userPrivilegeList, uid, 0),
			user.isAdministrator(uid),
		]);

		const combined = userPrivileges.map(allowed => allowed || isAdministrator);
		const privData = _.zipObject(privileges.admin.userPrivilegeList, combined);

		privData.superadmin = isAdministrator;
		return await plugins.hooks.fire('filter:privileges.admin.get', privData);
	};

	privileges.admin.can = async function (privilege, uid) {
		const [isUserAllowedTo, isAdministrator] = await Promise.all([
			helpers.isAllowedTo(privilege, uid, [0]),
			user.isAdministrator(uid),
		]);
		return isAdministrator || isUserAllowedTo[0];
	};

	// privileges.admin.canGroup = async function (privilege, groupName) {
	// 	return await groups.isMember(groupName, 'cid:0:privileges:groups:' + privilege);
	// };

	privileges.admin.give = async function (privileges, groupName) {
		await helpers.giveOrRescind(groups.join, privileges, 'admin', groupName);
		plugins.hooks.fire('action:privileges.admin.give', {
			privileges: privileges,
			groupNames: Array.isArray(groupName) ? groupName : [groupName],
		});
	};

	privileges.admin.rescind = async function (privileges, groupName) {
		await helpers.giveOrRescind(groups.leave, privileges, 'admin', groupName);
		plugins.hooks.fire('action:privileges.admin.rescind', {
			privileges: privileges,
			groupNames: Array.isArray(groupName) ? groupName : [groupName],
		});
	};

	// privileges.admin.userPrivileges = async function (uid) {
	// 	const tasks = {};
	// 	privileges.admin.userPrivilegeList.forEach(function (privilege) {
	// 		tasks[privilege] = groups.isMember(uid, 'cid:0:privileges:' + privilege);
	// 	});
	// 	return await utils.promiseParallel(tasks);
	// };

	// privileges.admin.groupPrivileges = async function (groupName) {
	// 	const tasks = {};
	// 	privileges.admin.groupPrivilegeList.forEach(function (privilege) {
	// 		tasks[privilege] = groups.isMember(groupName, 'cid:0:privileges:' + privilege);
	// 	});
	// 	return await utils.promiseParallel(tasks);
	// };
};
