'use strict';

const anecdotesController = module.exports;

anecdotesController.get = async function (req, res) {
	res.render('admin/manage/anecdotes/index', {
		title: "Manage Anecdotes",
		message: "hello this is working",
	});
};

anecdotesController.getSaved = async function (req, res) {
	res.render('admin/manage/anecdotes/saved', {
		title: "Saved Anecdotes",
		message: "hello this is working",
	});
};

anecdotesController.getAdd = async function (req, res) {
	res.render('admin/manage/anecdotes/add', {
		title: "Add Anecdotes",
		message: "hello this is working",
	});
};