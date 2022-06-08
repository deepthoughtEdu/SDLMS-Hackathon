'use strict';

const utils = module.exports;

utils.isJSON = (t) => {
	t = typeof t !== 'string' ? JSON.stringify(t) : t;
	try {
		t = JSON.parse(t);
	} catch (t) {
		return !1;
	}
	return typeof t === 'object' && t !== null;
};

/**
 *
 * @date 11-04-2022
 * @function updateQueryStringParameter
 * @param {String} uri URL
 * @param {*} key
 * @param {*} value
 * @returns String
 */
utils.updateQueryStringParameter = (uri, key, value) => {
	var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
	var separator = uri.indexOf('?') !== -1 ? '&' : '?';
	if (uri.match(re)) {
		return uri.replace(re, '$1' + key + '=' + value + '$2');
	}
	return uri + separator + key + '=' + value;
};

utils.generateUUID = (prefix = "") => {
    var dt = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-yxxx-yxxx".replace(/[xy]/g, (c) => {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return prefix + uuid;
}
utils.isParsableJSON = (item) => {
	try {
		JSON.parse(item);
	} catch (e) {
		return false;
	}
	return true;
}
/**
  * @author imshawan
  * @date 14-02-2022
  * @function paginate
  * @description Properly organises the pagination response for a particular request
  * @param {*} url Request URL
  * @param {*} data Pagination data returned back from database
  * @param {*} count Total count of mongodb documents that matches a particular query
  * @param {*} limit Number of documents per page
  * @param {*} page Current page number
  * @returns Object
  */

utils.paginate = (url, data, count, limit, page) => {
	url = utils.updateQueryStringParameter(url, 'limit', limit);
	page = parseInt(page);

	var last_page = count ? Math.floor(count / limit) : 0;
	var first_page_url = utils.updateQueryStringParameter(url, 'page', 0);
	var next_page_url = page === last_page ? null : utils.updateQueryStringParameter(url, 'page', (page + 1));
	var prev_page_url = page === 0 ? null : utils.updateQueryStringParameter(url, 'page', (page - 1));
	var last_page_url = utils.updateQueryStringParameter(url, 'page', (Math.floor(count / limit)));

	return {
		data: data,
		// total: count,
		per_page: limit,
		current_page: page,
		first_page_url: first_page_url ? first_page_url.toString() : null,
		last_page_url: last_page_url ? last_page_url.toString() : null,
		next_page_url: next_page_url ? next_page_url.toString() : null,
		prev_page_url: prev_page_url ? prev_page_url.toString() : null,
		last_page: last_page,
		from: page * limit,
		to: page + 1,
	};
};


/**
 *
 * @date 14-02-2022
 * @function updateQueryStringParameter
 * @param {String} uri URL
 * @param {*} key
 * @param {*} value
 * @returns String
 */
utils.updateQueryStringParameter = (uri, key, value) => {
	var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
	var separator = uri.indexOf('?') !== -1 ? '&' : '?';
	if (uri.match(re)) {
		return uri.replace(re, '$1' + key + '=' + value + '$2');
	}
	return uri + separator + key + '=' + value;
};
