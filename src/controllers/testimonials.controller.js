const { body, validationResult } = require('express-validator');
var multer = require("multer");
const { createSlug } = require("../utils/global.helper");
const models = require("../models");
const { triggerRevalidate } = require("../utils/revalidate.helper");
const Testimonials = models.testimonials;
const Countries = models.country;
const { dateFormat } = require("../services/date.service");
const fs = require("fs");


const { processAndConvertImageToWebp } = require("../utils/image.helper");
const title = "Testimonials";
const page = "testimonials";
const pageUrl = "testimonials";
const metaTitle = siteName + " | Testimonials";

const list = async (req, res) => {
	var action = req.query.action;
	var rows = await Testimonials.findAll({ where: {}, order: [['id', 'DESC']] });
	const countries = await Countries.findAll();
	res.render("testimonials", {
		title: title + "",
		page: page,
		pageUrl: pageUrl,
		metaTitle: metaTitle,
		action: action,
		countries: countries,
		rows: rows
	});
};

const add = async (req, res) => {
	var action = req.query.action;
	const countries = await Countries.findAll();
	res.render("testimonials", {
		title: "Add " + title,
		page: page,
		pageUrl: pageUrl,
		metaTitle: metaTitle,
		action: action,
		countries: countries,
		row: []
	});
};

const view = async (req, res) => {
	var action = req.query.action;
	var getId = req.query.id;
	const countries = await Countries.findAll();
	const row = await Testimonials.findOne({ where: { id: getId } });
	res.render("testimonials", {
		title: "View " + title,
		page: page,
		pageUrl: pageUrl,
		metaTitle: metaTitle,
		action: action,
		countries: countries,
		row: row
	});
};

const edit = async (req, res) => {
	var action = req.query.action;
	var getId = req.query.id;
	const countries = await Countries.findAll();
	const row = await Testimonials.findOne({ where: { id: getId } });
	console.log(row.photo);
	res.render("testimonials", {
		title: "Edit " + title,
		page: page,
		pageUrl: pageUrl,
		metaTitle: metaTitle,
		action: action,
		countries: countries,
		row: row
	});
};

const destroy = async (req, res) => {
	var getId = req.query.id;
	await Testimonials.destroy({ where: { id: getId } });
	triggerRevalidate(["testimonials-page", "google-reviews"], ["/testimonial", "/"]);
	await req.flash("success", "Testimonial deleted successfully.");
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

		var dirForUpload = "./public/uploads/testimonials/";
		if (!fs.existsSync(dirForUpload)) {
			fs.mkdirSync(dirForUpload);
		}

		var storage = multer.diskStorage({
			destination: function (req, file, callback) {
				callback(null, "./public/uploads/testimonials/");
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
			await body('name', 'Title is required.').notEmpty().run(req);
			await body('country', 'Country name is required.').notEmpty().run(req);
			await body('description', 'Description is required.').notEmpty().run(req);

			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				req.flash("error", errors.array()[0].msg);
				res.redirect('back');
				return;
			}
			// if(!req.files.photo){
			// 	req.flash("error", "Please Upload the required Images");
			// 	res.redirect('back');
			// 	return;
			// }

			// order_no, name, country, rating, description, photo, altTag, status, publishedAt

			const { id, name, country, rating, description, photo_old, altTag, status, slug } = req.body;
			let image = photo_old;
			if (req.files && req.files.photo && req.files.photo[0]) {
				image = await processAndConvertImageToWebp(req.files.photo[0], "./public/uploads/testimonials/");
			}
			const countr = await Countries.findOne({ where: { name: country } });
			const formData = {
				name: name,
				country: country,
				flag: `https://flagsapi.com/${countr.code}/flat/64.png`,
				rating: rating,
				description: description,
				photo: image,
				slug: slug,
				altTag: altTag || name,
				status: status
			};
			if (id != '') {
				await Testimonials.update(formData, { where: { id: id } });
				await req.flash("success", "Testimonial updated successfully.");
			}
			else {
				formData.slug = createSlug(name);

				await Testimonials.create(formData);
				await req.flash("success", "Testimonial created successfully.");
			}
			triggerRevalidate(["testimonials-page", "google-reviews"], ["/testimonial", "/"]);
			res.redirect(siteUrl + "/" + pageUrl);
		});
	},
};
