'use strict';

const winston = require('winston');
const meta = require('../../meta');
const plugins = require('../../plugins');
const middleware = require('../../middleware');
const writeControllers = require('../../controllers/write');
const helpers = require('../../controllers/helpers');

const Write = module.exports;

Write.reload = async (params) => {
	const router = params.router;
	let apiSettings = await meta.settings.get('core.api');
	plugins.registerHook('core', {
		hook: 'action:settings.set',
		method: async (data) => {
			if (data.plugin === 'core.api') {
				apiSettings = await meta.settings.get('core.api');
			}
		},
	});

	router.use('/api/v3', function (req, res, next) {
		// Require https if configured so
		if (apiSettings.requireHttps === 'on') {
			res.set('Upgrade', 'TLS/1.0, HTTP/1.1');
			return helpers.formatApiResponse(426, res);
		}

		res.locals.isAPI = true;
		next();
	});

	router.use('/api/v3/users', require('./users')());
	router.use('/api/v3/groups', require('./groups')());
	router.use('/api/v3/categories', require('./categories')());
	router.use('/api/v3/topics', require('./topics')());
	router.use('/api/v3/posts', require('./posts')());
	router.use('/api/v3/admin', require('./admin')());
	router.use('/api/v3/files', require('./files')());
	router.use('/api/v3/utilities', require('./utilities')());
	router.use('/api/v3/sdlms', require('./sdlms')());
	router.use('/api/v3/app', require('./app')());
	router.use('/api/v3/apps', require('./dt_thon')());
	router.use('/api/v3/payments', require('./payments')());
	router.use('/api/v3/profile', require('./profile')());
	router.use('/api/v3/articles', require('./articles_home')());

	router.get('/api/v3/ping', writeControllers.utilities.ping.get);
	router.post('/api/v3/ping', middleware.authenticate, writeControllers.utilities.ping.post);

	/**
	 * Plugins can add routes to the Write API by attaching a listener to the
	 * below hook. The hooks added to the passed-in router will be mounted to
	 * `/api/v3/plugins`.
	 */
	const pluginRouter = require('express').Router();
	await plugins.hooks.fire('static:api.routes', {
		router: pluginRouter,
		middleware,
		helpers,
	});
	winston.info(`[api] Adding ${pluginRouter.stack.length} route(s) to \`api/v3/plugins\``);
	router.use('/api/v3/plugins', pluginRouter);

	// 404 handling
	router.use('/api/v3', (req, res) => {
		helpers.formatApiResponse(404, res);
	});
};
