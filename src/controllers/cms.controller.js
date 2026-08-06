const { body, validationResult } = require('express-validator');
var multer = require("multer");
const { createSlug } = require("../utils/global.helper");
const models = require("../models");
const Cms = models.cms;
const pageModel = models.page;
const fs = require("fs");
const { Op } = require("sequelize");

const { processAndConvertImageToWebp } = require("../utils/image.helper");
const title 	= "CMS";
const page  	= "cms";
const pageUrl   = "cms";
const metaTitle = siteName + " - CMS";

const list = async (req, res) => {
    var action = req.query.action;
    var rows   = await Cms.findAll({ where: {}, order: [ ['updatedAt', 'DESC'] ]});
    // var usedPages = [];
	// for(let k = 0; k < rows.length; k++)
	// {usedPages.push(rows[k]['page_id']);}
	// usedPages = Array.from(new Set(usedPages));
	// const pages = await pageModel.findAll({
	// 	where: { id: {[Op.notIn]: usedPages} },
	// });
	// var rows   = await Cms.findAll({include: [pageModel],});
    res.render("cms", {
        title:  	title,
        page:   	page,
		pageUrl: 	pageUrl,
		metaTitle:  metaTitle,
        action: 	action,
        // pages:      pages,
        rows:		rows
    });
};
  
const add = async (req, res) => {
    var action = req.query.action;
    var cms = await Cms.findAll({where: {status: 1},});
	// var usedPages = [];
	// for(let k = 0; k < cms.length; k++)
	// {usedPages.push(cms[k]['page_id']);}
	// usedPages = Array.from(new Set(usedPages));
	// const pages = await pageModel.findAll({
	// 	where: { id: {[Op.notIn]: usedPages} },
	// });
    // const pages = await pageModel.findAll();
    res.render("cms", {
		title:  	"Add "+title,
		page:   	page,
		pageUrl: 	pageUrl,
		metaTitle:  metaTitle,
        action: 	action,
        // pages:		pages,
		row:		[]
    });
};

const view = async (req, res) => {
	var action = req.query.action;
	var getId  = req.query.id;
	const row  = await Cms.findOne({ where: {id: getId}});
	res.render("cms", {
		title:  	"View "+title,
		page:   	page,
		pageUrl: 	pageUrl,
		metaTitle:  metaTitle,
        action: 	action,
		row:		row
	});
};
  
const edit = async (req, res) => {
	var action = req.query.action;
	var getId  = req.query.id;
    // const pages= await pageModel.findAll();
	const row  = await Cms.findOne({ where: {id: getId} });
    res.render("cms", {
		title:  	"Edit "+title,
		page:   	page,
		pageUrl: 	pageUrl,
		metaTitle:  metaTitle,
        action: 	action,
        // pages:		pages,
		row:		row
    });
};

const destroy = async (req, res) => {
	var getId  = req.query.id;
	await Cms.destroy({ where: {id: getId}});
	await req.flash("success", "CMS deleted successfully.");
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
        try{

        var dirForUpload = "./public/uploads/cms/";
		if (!fs.existsSync(dirForUpload)) {
			fs.mkdirSync(dirForUpload);
		}

        var storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, "./public/uploads/cms/");
            },
            filename: function (req, file, callback) {
                callback(null, Date.now() + "-" + file.originalname);
            },
        });

        const initUpload = multer({ storage: storage });
        const uploadMiddleware = initUpload.fields([
            { name: "image", maxCount: 1 },
        ]);
        uploadMiddleware(req, res, async () => {
        // await body('page_id','Page is required.').notEmpty().run(req);
        await body('title','Title is required.').notEmpty().run(req);
        await body('shadow_title','Shadow Title is required.').notEmpty().run(req);
	    await body('description','Description is required.').notEmpty().run(req);
        await body('slug','Slug is required.').notEmpty().run(req);
        // await body('image','image is required.').notEmpty().run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash("error", errors.array()[0].msg);
            res.redirect('back');
            return;
        }

        // const {id,page_id, title, shadow_title, description, image_old, alt_tag, status, slug} = req.body;
        const {id, title, shadow_title, banner_heading, description, image_old, alt_tag, status, slug} = req.body;
        let image = image_old;
        if (req.files && req.files.image && req.files.image[0]) {
            image = await processAndConvertImageToWebp(req.files.image[0], "./public/uploads/cms/");
        }

        if(!image){
            req.flash("error", "Please Upload the required Images");
            res.redirect('back');
            return;
        }

        const formData = {
            // page_id: page_id,
            banner_heading: banner_heading,
            title:       title,
            shadow_title: shadow_title,
            description: description,
            image:       image,
            alt_tag:     alt_tag,
            status:      status,
            slug:        slug
        };

        if(id && id != '')
        {
            await Cms.update(formData, {where: {id: id}});
            await req.flash("success", "CMS updated successfully.");
        }
        else
        {
            formData.slug = createSlug(title);

            await Cms.create(formData);
            await req.flash("success", "CMS created successfully.");
        }
        res.redirect(siteUrl + "/" + pageUrl);
    });
}catch(e){console.log(e);}
	},    
};
