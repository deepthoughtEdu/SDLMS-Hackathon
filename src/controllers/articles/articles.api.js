/**
 * @date 11-05-2022
 * @author imshawan
 * @description This file contains all the API functionalities for the Article's sub-domain
 */
 "use strict";

 const db = require("../../database");
 const User = require("../../user");
 const utilities = require("../utils");
 const helpers = require('../helpers');

 const articlesApi = module.exports;

 articlesApi.addToFeatured = async function (req, res) {
    const uid = parseInt(req.uid);
    if (!req.uid || uid < 1) {
        throw new Error("Unauthorized");
    }

    const pid = Number(req.params.pid);
    if (!pid || pid < 1) throw new Error("Invalid pid");

    const articleData = await db.findField(db.collections.DEFAULT, { pid: pid, type: "article" });
    if (!articleData) throw new Error("Invalid Article");

    await Promise.all([
        db.updateField(db.collections.DEFAULT, { pid: pid, type: "article" }, { $set: { featured: true } }),
        publishArticle({ ...articleData, featured: true }),
    ]);

    helpers.formatApiResponse(200, res, { success: true });
 }

 
 /**
  * @date 07-05-2022
  * @author imshawan
  * @function publishArticle
  * @description This function is used to approve a particular article that is going to be displayed on the article's sub-domain
  * @param {Object} data 
  */

  async function publishArticle (data) {
	const key = { _key: `article:${data.pid}:approved` };
	const collectionName = db.collections.SDLMS.ARTICLES_HOME;
	let article = await db.findField(collectionName, key);

	const approvedArticleData = {};

	if (data.content) {
		// Converting HTML data to normal text and generating a mini-content for the article
		let content = data.content.replace(/(<([^>]+)>)/g, "");
		approvedArticleData.content = content.substr(0, 140) + '...';
	}

	['uid','pid' ,'tid', 'title', 'cid', 'image', 'sub_cid', 'viewcount', 'featured', 'wordcount', 'status'].forEach(field => {
		if (data[field]) approvedArticleData[field] = data[field];
	})

	if (article) {
		await db.updateField(collectionName, key, { $set: approvedArticleData }, { upsert: false });
	} else {
		await db.setField(collectionName, { ...approvedArticleData, ...key });
	}
 }