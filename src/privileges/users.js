
'use strict';

const _ = require('lodash');

const user = require('../user');
const meta = require('../meta');
const groups = require('../groups');
const plugins = require('../plugins');
const helpers = require('./helpers');

module.exports = function (privileges) {
	privileges.users = {};

	privileges.users.isAdministrator = async function (uid) {
		return await isGroupMember(uid, 'administrators');
	};

	privileges.users.isGlobalModerator = async function (uid) {
		return await isGroupMember(uid, 'Global Moderators');
	};

	privileges.users.isTeacher = async function (uid) {
		return await isGroupMember(uid, 'Teachers');
	};

	privileges.users.isStudent = async function (uid) {
		return await isGroupMember(uid, 'Students');
	};
	privileges.users.isParent = async function (uid) {
		return await isGroupMember(uid, 'Parents');
	};
	privileges.users.isRecruiter = async function (uid) {
		return await isGroupMember(uid, 'Recruiter');
	};

	async function isGroupMember(uid, groupName) {
		return await groups[Array.isArray(uid) ? 'isMembers' : 'isMember'](uid, groupName);
	}

	privileges.users.isModerator = async function (uid, cid) {
		if (Array.isArray(cid)) {
			return await isModeratorOfCategories(cid, uid);
		} else if (Array.isArray(uid)) {
			return await isModeratorsOfCategory(cid, uid);
		}
		return await isModeratorOfCategory(cid, uid);
	};

	async function isModeratorOfCategories(cids, uid) {
		if (parseInt(uid, 10) <= 0) {
			return await filterIsModerator(cids, uid, cids.map(() => false));
		}

		const isGlobalModerator = await privileges.users.isGlobalModerator(uid);
		if (isGlobalModerator) {
			return await filterIsModerator(cids, uid, cids.map(() => true));
		}
		const uniqueCids = _.uniq(cids);
		const isAllowed = await helpers.isAllowedTo('moderate', uid, uniqueCids);

		const cidToIsAllowed = _.zipObject(uniqueCids, isAllowed);
		const isModerator = cids.map(cid => cidToIsAllowed[cid]);
		return await filterIsModerator(cids, uid, isModerator);
	}

	async function isModeratorsOfCategory(cid, uids) {
		const [check1, check2, check3] = await Promise.all([
			privileges.users.isGlobalModerator(uids),
			groups.isMembers(uids, 'cid:' + cid + ':privileges:moderate'),
			groups.isMembersOfGroupList(uids, 'cid:' + cid + ':privileges:groups:moderate'),
		]);
		const isModerator = uids.map((uid, idx) => check1[idx] || check2[idx] || check3[idx]);
		return await filterIsModerator(cid, uids, isModerator);
	}

	async function isModeratorOfCategory(cid, uid) {
		const result = await isModeratorOfCategories([cid], uid);
		return result ? result[0] : false;
	}

	async function filterIsModerator(cid, uid, isModerator) {
		const data = await plugins.hooks.fire('filter:user.isModerator', { uid: uid, cid: cid, isModerator: isModerator });
		if ((Array.isArray(uid) || Array.isArray(cid)) && !Array.isArray(data.isModerator)) {
			throw new Error('filter:user.isModerator - i/o mismatch');
		}

		return data.isModerator;
	}

	privileges.users.canEdit = async function (callerUid, uid) {
		if (parseInt(callerUid, 10) === parseInt(uid, 10)) {
			return true;
		}
		const [isAdmin, isGlobalMod, isTargetAdmin] = await Promise.all([
			privileges.users.isAdministrator(callerUid),
			privileges.users.isGlobalModerator(callerUid),
			privileges.users.isAdministrator(uid),
		]);

		const data = await plugins.hooks.fire('filter:user.canEdit', {
			isAdmin: isAdmin,
			isGlobalMod: isGlobalMod,
			isTargetAdmin: isTargetAdmin,
			canEdit: isAdmin || (isGlobalMod && !isTargetAdmin),
			callerUid: callerUid,
			uid: uid,
		});
		return data.canEdit;
	};

	privileges.users.canBanUser = async function (callerUid, uid) {
		const [canBan, isTargetAdmin] = await Promise.all([
			privileges.global.can('ban', callerUid),
			privileges.users.isAdministrator(uid),
		]);

		const data = await plugins.hooks.fire('filter:user.canBanUser', {
			canBan: canBan && !isTargetAdmin,
			callerUid: callerUid,
			uid: uid,
		});
		return data.canBan;
	};

	privileges.users.canFlag = async function (callerUid, uid) {
		const [userReputation, targetPrivileged, reporterPrivileged] = await Promise.all([
			user.getUserField(callerUid, 'reputation'),
			user.isPrivileged(uid),
			user.isPrivileged(callerUid),
		]);
		const minimumReputation = meta.config['min:rep:flag'];
		let canFlag = reporterPrivileged || (userReputation >= minimumReputation);

		if (targetPrivileged && !reporterPrivileged) {
			canFlag = false;
		}

		return { flag: canFlag };
	};

	privileges.users.hasBanPrivilege = async uid => await hasGlobalPrivilege('ban', uid);
	privileges.users.hasInvitePrivilege = async uid => await hasGlobalPrivilege('invite', uid);

	async function hasGlobalPrivilege(privilege, uid) {
		const privilegeName = privilege.split('-').map(word => word.slice(0, 1).toUpperCase() + word.slice(1)).join('');
		let payload = { uid };
		payload[`can${privilegeName}`] = await privileges.global.can(privilege, uid);
		payload = await plugins.hooks.fire(`filter:user.has${privilegeName}Privilege`, payload);
		return payload[`can${privilegeName}`];
	}
};
