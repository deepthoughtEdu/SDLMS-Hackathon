'use strict';

const nconf = require('nconf');
const validator = require('validator');

const db = require('../../database');
const user = require('../../user');
const categories = require('../../categories');
const groups = require('../../groups');
const meta = require('../../meta');
const pagination = require('../../pagination');
const events = require('../../events');

const groupsController = module.exports;

groupsController.list = async function (req, res) {
	const page = parseInt(req.query.page, 10) || 1;
	const groupsPerPage = 20;

	let groupNames = await getGroupNames();
	const pageCount = Math.ceil(groupNames.length / groupsPerPage);
	const start = (page - 1) * groupsPerPage;
	const stop = start + groupsPerPage - 1;
	groupNames = groupNames.slice(start, stop + 1);

	const allCategories = await categories.buildForSelectAll();
	const groupData = await groups.getGroupsData(groupNames);
	res.render('admin/manage/groups', {
		groups: groupData,
		pagination: pagination.create(page, pageCount),
		yourid: req.uid,
		categories: allCategories,
	});
};

groupsController.get = async function (req, res, next) {
	const groupName = req.params.name;
	const [groupNames, group, allCategories] = await Promise.all([
		getGroupNames(),
		groups.get(groupName, { uid: req.uid, truncateUserList: true, userListCount: 20 }),
		categories.buildForSelectAll(),
	]);

	if (!group) {
		return next();
	}
	group.isOwner = true;

	const groupNameData = groupNames.map(function (name) {
		return {
			encodedName: encodeURIComponent(name),
			displayName: validator.escape(String(name)),
			selected: name === groupName,
		};
	});

	res.render('admin/manage/group', {
		group: group,
		groupNames: groupNameData,
		allowPrivateGroups: meta.config.allowPrivateGroups,
		maximumGroupNameLength: meta.config.maximumGroupNameLength,
		maximumGroupTitleLength: meta.config.maximumGroupTitleLength,
		categories: allCategories,
	});
};

async function getGroupNames() {
	const groupNames = await db.getSortedSetRange('groups:createtime', 0, -1);
	return groupNames.filter(name => name !== 'registered-users' &&
		name !== 'verified-users' &&
		name !== 'unverified-users' &&
		!groups.isPrivilegeGroup(name)
	);
}

groupsController.getCSV = async function (req, res) {
	const referer = req.headers.referer;

	if (!referer || !referer.replace(nconf.get('url'), '').startsWith('/admin/manage/groups')) {
		return res.status(403).send('[[error:invalid-origin]]');
	}
	await events.log({
		type: 'getGroupCSV',
		uid: req.uid,
		ip: req.ip,
	});
	const groupName = req.params.groupname;
	const members = (await groups.getMembersOfGroups([groupName]))[0];
	const fields = ['email', 'username', 'uid'];
	const userData = await user.getUsersFields(members, fields);
	let csvContent = fields.join(',') + '\n';
	csvContent += userData.reduce((memo, user) => {
		memo += user.email + ',' + user.username + ',' + user.uid + '\n';
		return memo;
	}, '');

	res.attachment(validator.escape(groupName) + '_members.csv');
	res.setHeader('Content-Type', 'text/csv');
	res.end(csvContent);
};
