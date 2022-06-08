'use strict';

const validator = require('validator');
const nconf = require('nconf');
const winston = require('winston');

const meta = require('../meta');
const user = require('../user');
const categories = require('../categories');
const plugins = require('../plugins');
const translator = require('../translator');
const languages = require('../languages');
const api = require('../api');

const apiController = module.exports;

const relative_path = nconf.get('relative_path');
const upload_url = nconf.get('upload_url');
const socketioTransports = nconf.get('socket.io:transports') || ['polling', 'websocket'];
const socketioOrigins = nconf.get('socket.io:origins');
const websocketAddress = nconf.get('socket.io:address') || '';

apiController.loadConfig = async function (req) {
	const config = {
		relative_path,
		upload_url,
		assetBaseUrl: `${relative_path}/assets`,
		siteTitle: validator.escape(String(meta.config.title || meta.config.browserTitle || 'NodeBB')),
		browserTitle: validator.escape(String(meta.config.browserTitle || meta.config.title || 'NodeBB')),
		titleLayout: (meta.config.titleLayout || '{pageTitle} | {browserTitle}').replace(/{/g, '&#123;').replace(/}/g, '&#125;'),
		showSiteTitle: meta.config.showSiteTitle === 1,
		minimumTitleLength: meta.config.minimumTitleLength,
		maximumTitleLength: meta.config.maximumTitleLength,
		minimumPostLength: meta.config.minimumPostLength,
		maximumPostLength: meta.config.maximumPostLength,
		minimumTagsPerTopic: meta.config.minimumTagsPerTopic || 0,
		maximumTagsPerTopic: meta.config.maximumTagsPerTopic || 5,
		minimumTagLength: meta.config.minimumTagLength || 3,
		maximumTagLength: meta.config.maximumTagLength || 15,
		useOutgoingLinksPage: meta.config.useOutgoingLinksPage === 1,
		outgoingLinksWhitelist: meta.config.useOutgoingLinksPage === 1 ? meta.config['outgoingLinks:whitelist'] : undefined,
		allowGuestHandles: meta.config.allowGuestHandles === 1,
		allowTopicsThumbnail: meta.config.allowTopicsThumbnail === 1,
		usePagination: meta.config.usePagination === 1,
		disableChat: meta.config.disableChat === 1,
		disableChatMessageEditing: meta.config.disableChatMessageEditing === 1,
		maximumChatMessageLength: meta.config.maximumChatMessageLength || 1000,
		socketioTransports,
		socketioOrigins,
		websocketAddress,
		maxReconnectionAttempts: meta.config.maxReconnectionAttempts,
		reconnectionDelay: meta.config.reconnectionDelay,
		topicsPerPage: meta.config.topicsPerPage || 20,
		postsPerPage: meta.config.postsPerPage || 20,
		maximumFileSize: meta.config.maximumFileSize,
		'theme:id': meta.config['theme:id'],
		'theme:src': meta.config['theme:src'],
		defaultLang: meta.config.defaultLang || 'en-GB',
		userLang: req.query.lang ? validator.escape(String(req.query.lang)) : (meta.config.defaultLang || 'en-GB'),
		loggedIn: !!req.user,
		uid: req.uid,
		'cache-buster': meta.config['cache-buster'] || '',
		requireEmailConfirmation: meta.config.requireEmailConfirmation === 1,
		topicPostSort: meta.config.topicPostSort || 'oldest_to_newest',
		categoryTopicSort: meta.config.categoryTopicSort || 'newest_to_oldest',
		csrf_token: req.uid >= 0 && req.csrfToken && req.csrfToken(),
		searchEnabled: plugins.hooks.hasListeners('filter:search.query'),
		bootswatchSkin: meta.config.bootswatchSkin || '',
		enablePostHistory: meta.config.enablePostHistory === 1,
		timeagoCutoff: meta.config.timeagoCutoff !== '' ? Math.max(0, parseInt(meta.config.timeagoCutoff, 10)) : meta.config.timeagoCutoff,
		timeagoCodes: languages.timeagoCodes,
		cookies: {
			enabled: meta.config.cookieConsentEnabled === 1,
			message: translator.escape(validator.escape(meta.config.cookieConsentMessage || '[[global:cookies.message]]')).replace(/\\/g, '\\\\'),
			dismiss: translator.escape(validator.escape(meta.config.cookieConsentDismiss || '[[global:cookies.accept]]')).replace(/\\/g, '\\\\'),
			link: translator.escape(validator.escape(meta.config.cookieConsentLink || '[[global:cookies.learn_more]]')).replace(/\\/g, '\\\\'),
			link_url: translator.escape(validator.escape(meta.config.cookieConsentLinkUrl || 'https://www.cookiesandyou.com')).replace(/\\/g, '\\\\'),
		},
		thumbs: {
			size: meta.config.topicThumbSize,
		},
	};

	let settings = config;
	let isAdminOrGlobalMod;
	if (req.loggedIn) {
		([settings, isAdminOrGlobalMod] = await Promise.all([
			user.getSettings(req.uid),
			user.isAdminOrGlobalMod(req.uid),
		]));
	}

	// Handle old skin configs
	const oldSkins = ['noskin', 'default'];
	settings.bootswatchSkin = oldSkins.includes(settings.bootswatchSkin) ? '' : settings.bootswatchSkin;

	config.usePagination = settings.usePagination;
	config.topicsPerPage = settings.topicsPerPage;
	config.postsPerPage = settings.postsPerPage;
	config.userLang = validator.escape(String((req.query.lang ? req.query.lang : null) || settings.userLang || config.defaultLang));
	config.acpLang = validator.escape(String((req.query.lang ? req.query.lang : null) || settings.acpLang));
	config.openOutgoingLinksInNewTab = settings.openOutgoingLinksInNewTab;
	config.topicPostSort = settings.topicPostSort || config.topicPostSort;
	config.categoryTopicSort = settings.categoryTopicSort || config.categoryTopicSort;
	config.topicSearchEnabled = settings.topicSearchEnabled || false;
	config.bootswatchSkin = (meta.config.disableCustomUserSkins !== 1 && settings.bootswatchSkin && settings.bootswatchSkin !== '') ? settings.bootswatchSkin : '';

	// Overrides based on privilege
	config.disableChatMessageEditing = isAdminOrGlobalMod ? false : config.disableChatMessageEditing;

	return await plugins.hooks.fire('filter:config.get', config);
};

apiController.getConfig = async function (req, res) {
	const config = await apiController.loadConfig(req);
	res.json(config);
};

// TODO: Deprecate these four controllers in 1.17.0
apiController.getPostData = async (pid, uid) => api.posts.get({ uid }, { pid });
apiController.getTopicData = async (tid, uid) => api.topics.get({ uid }, { tid });
apiController.getCategoryData = async (cid, uid) => api.categories.get({ uid }, { cid });
apiController.getObject = async function (req, res, next) {
	const methods = {
		post: apiController.getPostData,
		topic: apiController.getTopicData,
		category: apiController.getCategoryData,
	};
	const method = methods[req.params.type];
	if (!method) {
		return next();
	}

	winston.warn('[api] This route has been deprecated and will likely be removed in v1.17.0');
	winston.warn('[api] Use GET /api/v3/(posts|topics|categories)/:id instead');

	try {
		const result = await method(req.params.id, req.uid);
		if (!result) {
			return next();
		}

		res.json(result);
	} catch (err) {
		next(err);
	}
};

apiController.getModerators = async function (req, res) {
	const moderators = await categories.getModerators(req.params.cid);
	res.json({ moderators: moderators });
};

require('../promisify')(apiController, ['getConfig', 'getObject', 'getModerators']);
