const { body, validationResult } = require('express-validator');
var multer = require("multer");
const { createSlug } = require("../utils/global.helper");
const models = require("../models");
const SubServicesSettings = models.serviceSettings;
const { Op } = require("sequelize");
const ServicePages = models.servicePages;
const ServiceFaq = models.serviceFaq;
const fs = require("fs");

const title 	= "Service Details Settings";
const page  	= "subServicesPage";
const pageUrl   = "sub_services_page_settings";
const metaTitle = siteName + " - Service Details Settings";

const list = async (req, res) => {
    var action = req.query.action;
    var rows   = await SubServicesSettings.findAll({ where: {for_main: 0}, order: [ ['createdAt', 'ASC'] ], include: [ServicePages]  });
    var usedPages = [];
	for(let k = 0; k < rows.length; k++)
	{usedPages.push(rows[k]['serviceTitleId']);}
	usedPages = Array.from(new Set(usedPages));
	const pages = await ServicePages.findAll({
		where: { id: {[Op.notIn]: usedPages},for_main: 0 },
	});
    res.render("subServicesPage", {
        title:  	title,
        page:   	page,
		pageUrl: 	pageUrl,
        pages:      pages,
		metaTitle:  metaTitle,
        action: 	action,
        rows:		rows
    });
};
  
const add = async (req, res) => {
    var action = req.query.action;
    // const pages = await ServicePages.findAll({ where: {for_main: 0}});
    var rows   = await SubServicesSettings.findAll({ where: {for_main:0}, order: [ ['updatedAt', 'DESC'] ]});
    var usedPages = [];
	for(let k = 0; k < rows.length; k++)
	{usedPages.push(rows[k]['serviceTitleId']);}
	usedPages = Array.from(new Set(usedPages));
	const pages = await ServicePages.findAll({
		where: { id: {[Op.notIn]: usedPages},for_main: 0 },
	});
    res.render("subServicesPage", {
		title:  	"Add "+title,
		page:   	page,
		pageUrl: 	pageUrl,
		metaTitle:  metaTitle,
        action: 	action,
        pages:		pages,
		row:		[]
    });
};

const view = async (req, res) => {
	var action = req.query.action;
	var getId  = req.query.id;
	const row  = await SubServicesSettings.findOne({ where: {id: getId}, include: [ServicePages] });
	res.render("subServicesPage", {
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
    const pages= await ServicePages.findAll({ where: {for_main: 0}});
	const row  = await SubServicesSettings.findOne({ where: {id: getId} });
    res.render("subServicesPage", {
		title:  	"Edit "+title,
		page:   	page,
		pageUrl: 	pageUrl,
		metaTitle:  metaTitle,
        action: 	action,
        pages:		pages,
		row:		row
    });
};

// const deleteFaq = async (req, res) => {
// 	var getId  = req.query.id;
// 	await ServiceFaq.destroy({ where: {id: getId}});
// 	await req.flash("success", "Faq deleted successfully.");
// 	res.redirect(siteUrl + "/" + pageUrl);
// };

const destroy = async (req, res) => {
	var getId  = req.query.id;
	await SubServicesSettings.destroy({ where: {id: getId}});
	await req.flash("success", "Titles deleted successfully.");
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
            case "deleteTitle":
                destroy(req, res);
                break;
            default:
                list(req, res);
        }
    },

	store: async function store(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash("error", errors.array()[0].msg);
            res.redirect('back');
            return;
        }

        const {id,page_id, title, shadow_title} = req.body;
        console.log({id,page_id, title, shadow_title});
        
        const formData = {
            serviceTitleId: page_id,
            title:       title,
            shadow_title: shadow_title,
            for_main: 0
        };

        if(id && id != '')
        {
            await SubServicesSettings.update(formData, {where: {id: id}});
            await req.flash("success", "Service Page Title updated successfully.");
        }
        else
        {
            await SubServicesSettings.create(formData);
            await req.flash("success", "Service Page Title created successfully.");
        }
        res.redirect(siteUrl + "/" + pageUrl);
	},

};
