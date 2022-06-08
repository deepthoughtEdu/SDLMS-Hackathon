const sharerController = module.exports;
const db = require("../database");
const api = require('../api');
const user = require('../user');

sharerController.get = async function (req, res, next) {
	const collectionName = db.collections.DEFAULT;
	let id = req.query.id,
		uid = parseInt(req.uid),
		data;

	if (!uid) return res.redirect(`/login`);
	try {
		data = await db.findField(collectionName, {
			uuid: id
		});

		if (!data) {
			throw new Error('Link you have followed is not valid');
		}

		if (Date.now() >= (data.expireAt || 0)) {
			throw new Error('Link you have followed has been expired');
		}
		data.members = (data.members || []).map(member => Number(member));

		if (data.mode == 'restricted' && !data.members.includes(uid)) {
			throw new Error('You are not authorized to view this link');
		}

		switch (data.type) {

		case 'class':
			let tid = Number(data.parent_id);

			const [session] = await Promise.all([
				db.findField(collectionName, {
					type: "session",
					tid: tid
				})
			]);
			if (!session) {
				throw new Error('No session found');
			}
			if (session ?.sharer?.id != id) {
				throw new Error('Link you have followed is not valid');
			}
			if (!session.isLive) {
				throw new Error('Class is not live');
			}
			await db.update(collectionName, {
				tid: tid,
				type: 'session',
				'members': {
					$ne: uid
				}
			}, {
				$push: {
					'members': uid
				}
			});
			let state = await api.sdlms.recordAttendance({
				uid,
				tid
			})
			if (state && state.joined) {
				return res.redirect(`/live/${tid}?share_redirect=true&url=/sharer?id=${req.query.id}`);
			} else throw new Error("Unable to join session at this moment. Please try again later");
			break;

		case 'eaglebuilder':
		case 'spreadsheet':
		case 'threadbuilder':
		case 'article':
			const [asset] = await Promise.all([
				db.findField(collectionName, {
					type: data.type,
					pid: data.tid
				})
			]);
			if (!asset) throw new Error('No asset found');
			// if (asset.sharer.id != id) throw new Error('Link you have followed is not valid');
			const userFields = ['username', 'picture', 'fullname', 'uid'];
			let userData = await user.getUserFields(Number(asset.uid || asset.userId), userFields);
			
			return res.render(`sdlms/sharer`, {
				title: asset.title || "Sharer",
				data: asset,
				userData: userData,
			});
			break;
		default:
			break;
		}
	} catch (error) {
		res.render("sdlms/sharer", {
			title: "Sharer",
			message: error.message
		});
	}
};