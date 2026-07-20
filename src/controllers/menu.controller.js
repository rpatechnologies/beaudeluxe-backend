const { body, validationResult } = require('express-validator');
var multer = require("multer");
const models = require("../models");
const menu = models.menu;

const title 	= "Menu";
const page  	= "menu";
const pageUrl   = "menu";
const metaTitle = siteName + " | Menu";

const list = async (req, res) => {
    var action = req.query.action;
	var rows   = await menu.findAll({ where: {}, order: [ ['id', 'ASC'] ]});
    res.render("menu", {
        title:  	title,
        page:   	page,
		pageUrl: 	pageUrl,
		metaTitle:  metaTitle,
        action: 	action,
        rows:		rows
    });
};
  
const add = async (req, res) => {
    var action = req.query.action;
    res.render("menu", {
		title:  	"Add "+title,
		page:   	page,
		pageUrl: 	pageUrl,
		metaTitle:  metaTitle,
        action: 	action,
		row:		[]
    });
};

const view = async (req, res) => {
	var action = req.query.action;
	var getId  = req.query.id;
	const row  = await menu.findOne({ where: {id: getId} });
	res.render("menu", {
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
	const row  = await menu.findOne({ where: {id: getId} });
    res.render("menu", {
		title:  	"Edit "+title,
		page:   	page,
		pageUrl: 	pageUrl,
		metaTitle:  metaTitle,
        action: 	action,
		row:		row
    });
};

const destroy = async (req, res) => {
	var getId  = req.query.id;
	await menu.destroy({ where: {id: getId}});
	await req.flash("success", "Menu deleted successfully.");
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
        await body('title','Title is required.').notEmpty().run(req);
        // await body('type','Menu type is required.').notEmpty().run(req);
        await body('status','Status is required.').notEmpty().run(req);
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash("error", errors.array()[0].msg);
            res.redirect('back');
            return;
        }

        const {id, type, title, status, slug, isMobile} = req.body;
        const formData = {
            type: 		 type,
            title: 		 title,
            status: 	 status,
            isMobile:    isMobile?1:0,
            slug: 	     slug
        };

        if(id && id != '')
        {
            await menu.update(formData, {where: {id: id}});
            await req.flash("success", "Menu updated successfully.");
        }
        else
        {
            await menu.create(formData);
            await req.flash("success", "Menu created successfully.");
        }
        res.redirect(siteUrl + "/" + pageUrl);
	},
};
