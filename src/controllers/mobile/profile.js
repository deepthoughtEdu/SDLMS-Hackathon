const user = require('../../user');
const profileController = module.exports;

const fields = [
	'uid',
	'username',
	'fullname',
	'userslug',
	'picture',
	'status',
	'assetsCount',
	'classes_attended',
	'signature',
	'aboutme',
	'birthday',
	'website',
	'location',
	'pronoun',
	'social_designation',
];


profileController.getEdit = async function (req, res, next) {
	var userProfile = await user.getUsersFields([req.uid], fields);
	res.render('mobile/profile/edit', {
		title: 'Profile',
		message: 'hello this is working',
		user: userProfile.length ? userProfile[0] : [],
	});
};

profileController.getView = async function (req, res, next) {
	const uid = parseInt(req.uid);
	if (!req.uid || uid < 1) {
		res.redirect('/');
	}
	var userProfile = await user.getUsersFields([req.uid], fields);
	if (!userProfile.length) {
		throw new Error('This user profile not found');
	}
	res.render('mobile/profile/view', {
		title: 'Profile',
		message: 'hello this is working',
		user: userProfile[0],
	});
};
