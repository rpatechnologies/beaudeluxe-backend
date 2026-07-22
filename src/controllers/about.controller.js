const { body, validationResult } = require('express-validator');
var multer = require("multer");
const models = require("../models");
const { json } = require('body-parser');
const About  = models.about;
const fs = require("fs");

const title 	= "About Us Content";
const page  	= "about";
const pageUrl   = "about";
const metaTitle = siteName + " | About Us";

const edit = async (req, res) => {
	var action = req.query.action;
	const row  = await About.findOne({ where: {id: 1} });
    const meths= row.methodology ? JSON.parse(row.methodology) : [];
    res.render("about", {
		title:  	title,
		page:   	page,
		pageUrl: 	pageUrl,
		metaTitle:  metaTitle,
        action: 	action,
		row:		row,
		meths:		meths
    });
};

module.exports = {

    index: async function (req, res) {
        edit(req, res);  
    },

	store: async function store(req, res) {

		var dirForUpload = "./public/uploads/about/";
		if (!fs.existsSync(dirForUpload)) {
			fs.mkdirSync(dirForUpload);
		}

		var storage = multer.diskStorage({
            destination: function (req, file, callback) {
				callback(null, "./public/uploads/about/");
            },
            filename: function (req, file, callback) {
                callback(null, Date.now() + "-" + file.originalname);
            },
        });
        const initUpload = multer({ storage: storage });
        const uploadMiddleware = initUpload.fields([
            { name: "image", maxCount: 1 },
            { name: "methodology_bg_img", maxCount: 1 }
        ]);
        uploadMiddleware(req, res, async () => {
			await body('title','Title is required.').notEmpty().run(req);
			await body('description','Description is required.').notEmpty().run(req);
			
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				req.flash("error", errors.array()[0].msg);
				res.redirect('back');
				return;
			}

            const request = req.body;
			const {title, description, image_old, altTag, methodology_bg_img_old, altTagMethodlology} = req.body;
			const image = req.files && req.files.image ? req.files.image[0].filename : image_old;
			const bgImage = req.files && req.files.methodology_bg_img ? req.files.methodology_bg_img[0].filename : methodology_bg_img_old;

			const formData = {
				title: 		 title,
				description: description,
				image:		 image,
				altTag:		altTag,
				methodology:    JSON.stringify(request.meth_title),
				methodology_bg_img: bgImage,
				altTagMethodlology: altTagMethodlology
			};

            await About.update(formData, {where: {id: 1}});
            await req.flash("success", "About us content updated successfully.");
			
			res.redirect(siteUrl + "/" + pageUrl);
		});
	},
};
