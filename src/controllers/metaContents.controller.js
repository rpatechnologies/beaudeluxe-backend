const { body, validationResult } = require('express-validator');
var multer = require("multer");
const { createSlug } = require("../utils/global.helper");
const models = require("../models");
const pageModel = models.page;
const MetaContents = models.metaContents;
const { dateFormat } = require("../services/date.service");
const { Op } = require("sequelize");
const fs = require("fs");
const { revalidateNextCache, revalidateAllNextCache } = require("../utils/revalidate.helper");

const title = "Meta Contents";
const page = "meta_contents";
const pageUrl = "meta_contents";
const metaTitle = siteName + " | Meta Contents";

const list = async (req, res) => {
	var action = req.query.action;
	var rows = await MetaContents.findAll({ where: {}, order: [['id', 'DESC']] });
	// var usedPages = [];
	// for(let k = 0; k < rows.length; k++)
	// {usedPages.push(rows[k]['page_id']);}
	// usedPages = Array.from(new Set(usedPages));
	// const pages = await pageModel.findAll({
	// 	where: { id: {[Op.notIn]: usedPages} },
	// });
	res.render("metaContents", {
		title: title + "",
		page: page,
		pageUrl: pageUrl,
		metaTitle: metaTitle,
		// pages:		pages,
		action: action,
		rows: rows
	});
};

const add = async (req, res) => {
	var action = req.query.action;
	// const pages = await pageModel.findAll();
	var metaContents = await MetaContents.findAll();
	// var usedPages = [];
	// for(let k = 0; k < metaContents.length; k++)
	// {usedPages.push(metaContents[k]['page_id']);}
	// usedPages = Array.from(new Set(usedPages));
	// const pages = await pageModel.findAll({
	// 	where: { id: {[Op.notIn]: usedPages} },
	// });
	res.render("metaContents", {
		title: "Add " + title,
		page: page,
		pageUrl: pageUrl,
		metaTitle: metaTitle,
		action: action,
		// pages:		pages,
		row: []
	});
};

const view = async (req, res) => {
	var action = req.query.action;
	var getId = req.query.id;
	const row = await MetaContents.findOne({ where: { id: getId }, });
	res.render("metaContents", {
		title: "View " + title,
		page: page,
		pageUrl: pageUrl,
		metaTitle: metaTitle,
		action: action,
		row: row
	});
};

const edit = async (req, res) => {
	var action = req.query.action;
	var getId = req.query.id;
	const row = await MetaContents.findOne({ where: { id: getId } });
	// const pages= await pageModel.findAll();
	res.render("metaContents", {
		title: "Edit " + title,
		page: page,
		pageUrl: pageUrl,
		metaTitle: metaTitle,
		action: action,
		// pages:		pages,
		row: row
	});
};

const destroy = async (req, res) => {
	var getId = req.query.id;
	await MetaContents.destroy({ where: { id: getId } });
	revalidateAllNextCache();
	await req.flash("success", "Meta Contents deleted successfully.");
	res.redirect(siteUrl + "/" + pageUrl);
};

module.exports = {

	index: async function (req, res) {
		var action = req.query.action;
		switch (action) {
			case "add":
				add(req, res);
				break;
			case "edit":
				edit(req, res);
				break;
			case "view":
				view(req, res);
				break;
			case "delete":
				destroy(req, res);
				break;
			default:
				list(req, res);
		}
	},

	store: async function store(req, res) {

		var dirForUpload = "./public/uploads/metaContents/";
		if (!fs.existsSync(dirForUpload)) {
			fs.mkdirSync(dirForUpload);
		}

		var storage = multer.diskStorage({
			destination: function (req, file, callback) {
				callback(null, "./public/uploads/metaContents/");
			},
			filename: function (req, file, callback) {
				callback(null, Date.now() + "-" + file.originalname);
			},
		});
		// console.log(storage);
		const initUpload = multer({ storage: storage });
		const uploadMiddleware = initUpload.fields([
			{ name: "photo", maxCount: 1 }
		]);
		uploadMiddleware(req, res, async () => {
			await body('metaTitle', 'Meta Title is required.').notEmpty().run(req);
			await body('metaDescription', 'Meta Description is required.').notEmpty().run(req);
			await body('metaKeywords', 'Meta Keywords are required.').notEmpty().run(req);

			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				req.flash("error", errors.array()[0].msg);
				res.redirect('back');
				return;
			}

			// order_no, name, country, rating, description, photo, altTag, status, createdAt

			const { id, metaTitle, metaDescription, metaKeywords, h1, h2, slug } = req.body;
			// const {id, page_id, metaTitle, metaDescription, metaKeywords, createdAt} = req.body;
			const formData = {
				metaTitle: metaTitle,
				metaDescription: metaDescription,
				metaKeywords: metaKeywords,
				h1: h1,
				h2: h2,
				slug: slug,
				// ,
				// createdAt: createdAt ? dateFormat(createdAt) : null
			};
			// console.log("formData", formData);
			if (id != '') {
				await MetaContents.update(formData, { where: { id: id } });
				await req.flash("success", "Meta Contents updated successfully.");
			}
			else {
				// formData.slug = createSlug(metaTitle);

				await MetaContents.create(formData);
				await req.flash("success", "Meta Contents created successfully.");
			}
			if (slug) {
				revalidateNextCache({ tags: [`meta:${slug}`], paths: [`/${slug}`] });
			} else {
				revalidateAllNextCache();
			}
			res.redirect(siteUrl + "/" + pageUrl);
		});
	},
};
