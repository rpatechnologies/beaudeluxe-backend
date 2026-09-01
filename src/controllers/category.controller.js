const { body, validationResult } = require('express-validator');
var multer = require("multer");
const { createSlug } = require("../utils/global.helper");
const models = require("../models");
const { triggerRevalidate } = require("../utils/revalidate.helper");
const Category = models.category;
const fs = require("fs");
const { Op } = require("sequelize");

const title 	= "Category";
const page  	= "category";
const pageUrl   = "category";
const metaTitle = siteName + " - CMS";

const list = async (req, res) => {
    var action = req.query.action;
    var rows   = await Category.findAll({ where: {},order: [["id", "DESC"]]});
    res.render("category", {
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
    res.render("category", {
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
	const row  = await Category.findOne({ where: {id: getId}});
	res.render("category", {
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
	const row  = await Category.findOne({ where: {id: getId} });
    res.render("category", {
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
	await Category.destroy({ where: {id: getId}});
	triggerRevalidate(["all-services", "meta:services"], ["/services"]);
	await req.flash("success", "Category deleted successfully.");
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
        ]);
        uploadMiddleware(req, res, async () => {
      
        // await body('image','image is required.').notEmpty().run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash("error", errors.array()[0].msg);
            res.redirect('back');
            return;
        }

        const {id, type, title} = req.body;

        const formData = {
            type:   type,      
            title:  title,
        };

        if(id && id != '')
        {
            await Category.update(formData, {where: {id: id}});
            await req.flash("success", "Category updated successfully.");
        }
        else
        {
            await Category.create(formData);
            await req.flash("success", "Category created successfully.");
        }
        triggerRevalidate(["all-services", "meta:services"], ["/services"]);
        res.redirect(siteUrl + "/" + pageUrl);
    });
}catch(e){console.log(e);}
	},    
};
