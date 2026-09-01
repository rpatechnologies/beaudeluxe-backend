const { body, validationResult } = require('express-validator');
var multer = require("multer");
const models = require("../models");
const { Op } = require("sequelize");
const fs = require("fs");
const cache = require("memory-cache");
const pageModel = models.page;
const Banner = models.banner;
const { revalidateNextCache, revalidateAllNextCache } = require("../utils/revalidate.helper");

const { processAndConvertImageToWebp } = require("../utils/image.helper");
const title = "Banner";
const page = "banner";
const pageUrl = "banner";
const metaTitle = siteName + " | Banner";

const list = async (req, res) => {
	var action = req.query.action;
	var rows = await Banner.findAll({ where: {}, include: [pageModel], order: [['updatedAt', 'DESC']] });
	const pages = await pageModel.findAll({ order: [['name', 'ASC']] });
	res.render("banner", {
		title: title + "s",
		page: page,
		pageUrl: pageUrl,
		pages: pages,
		metaTitle: metaTitle,
		action: action,
		rows: rows
	});
};

const add = async (req, res) => {
	var action = req.query.action;
	const pages = await pageModel.findAll({ order: [['name', 'ASC']] });
	res.render("banner", {
		title: "Add " + title,
		page: page,
		pageUrl: pageUrl,
		metaTitle: metaTitle,
		action: action,
		pages: pages,
		row: null
	});
};

const view = async (req, res) => {
	var action = req.query.action;
	var getId = req.query.id;
	const row = await Banner.findOne({ where: { id: getId }, include: [pageModel] });
	res.render("banner", {
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
	const pages = await pageModel.findAll();
	const row = await Banner.findOne({ where: { id: getId } });
	res.render("banner", {
		title: "Edit " + title,
		page: page,
		pageUrl: pageUrl,
		metaTitle: metaTitle,
		action: action,
		pages: pages,
		row: row
	});
};

const destroy = async (req, res) => {
	var getId = req.query.id;
	await Banner.destroy({ where: { id: getId } });
	cache.clear();
	revalidateAllNextCache();
	await req.flash("success", "Banner deleted successfully.");
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
		try {

			var dirForUpload = "./public/uploads/banners/";
			if (!fs.existsSync(dirForUpload)) {
				fs.mkdirSync(dirForUpload);
			}

			var storage = multer.diskStorage({
				destination: function (req, file, callback) {
					callback(null, "./public/uploads/banners/");
				},
				filename: function (req, file, callback) {
					callback(null, Date.now() + "-" + file.originalname);
				},
			});
			const initUpload = multer({ storage: storage });
			const uploadMiddleware = initUpload.fields([
				{ name: "image", maxCount: 1 },
				{ name: "image_mob", maxCount: 1 }
			]);
			uploadMiddleware(req, res, async () => {

				const errors = validationResult(req);
				if (!errors.isEmpty()) {
					req.flash("error", errors.array()[0].msg);
					res.redirect('back');
					return;
				}
				// if(!req.files.image){
				// 	req.flash("error", "Please Upload the required Image");
				// 	res.redirect('back');
				// 	return;
				// }
				// if(!req.files.image_mob){
				// 	req.flash("error", "Please Upload the required Mobile Image");
				// 	res.redirect('back');
				// 	return;
				// }

				const { id, page_id, title, service_title, status, description, image_old, altTagImage, image_mob_old, altTagImageMob } = req.body;
				let image = image_old;
				if (req.files && req.files.image && req.files.image[0]) {
					image = await processAndConvertImageToWebp(req.files.image[0], "./public/uploads/banners/");
				}
				let imageMob = image_mob_old;
				if (req.files && req.files.image_mob && req.files.image_mob[0]) {
					imageMob = await processAndConvertImageToWebp(req.files.image_mob[0], "./public/uploads/banners/");
				}

				const formData = {
					page_id: page_id,
					title: title,
					service_title: service_title,
					image: image,
					altTagImage: altTagImage,
					image_mob: imageMob,
					altTagImageMob: altTagImageMob,
					description: description,
					status: status,
					order_no: 1
				};

				if (id && id != '') {
					await Banner.update(formData, { where: { id: id } });
					await req.flash("success", "Banner updated successfully.");
				}
				else {
					await Banner.create(formData);
					await req.flash("success", "Banner created successfully.");
				}
				cache.clear();
				revalidateAllNextCache();
				res.redirect(siteUrl + "/" + pageUrl);
			});
		} catch (e) { console.log(e); }
	},
};
