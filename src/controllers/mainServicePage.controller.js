const { body, validationResult } = require('express-validator');
var multer = require("multer");
const { createSlug } = require("../utils/global.helper");
const { Op } = require("sequelize");
const { triggerRevalidate } = require("../utils/revalidate.helper");
const models = require("../models");
const MainServiceSettings = models.serviceSettings;
const ServicePages = models.servicePages;
const ServiceFaq = models.serviceFaq;
const fs = require("fs");

const title 	= "Main Service Settings";
const page  	= "mainServicePage";
const pageUrl   = "main_service_page_settings";
const metaTitle = siteName + " - MainServiceSettings";

const list = async (req, res) => {
    var action = req.query.action;
    var rows   = await MainServiceSettings.findAll({ where: {for_main:1}, order: [ ['id', 'ASC'] ], include: [ServicePages]  });
    var usedPages = [];
	for(let k = 0; k < rows.length; k++)
	{usedPages.push(rows[k]['serviceTitleId']);}
	usedPages = Array.from(new Set(usedPages));
	const pages = await ServicePages.findAll({
		where: { id: {[Op.notIn]: usedPages},for_main: 1 },
	});
    res.render("mainServicePage", {
        title:  	title,
        page:   	page,
		pageUrl: 	pageUrl,
		metaTitle:  metaTitle,
        pages:      pages,
        action: 	action,
        rows:		rows
    });
};
  
const add = async (req, res) => {
    var action = req.query.action;
    // const pages = await ServicePages.findAll({ where: {for_main: 1}});
    var rows   = await MainServiceSettings.findAll({ where: {for_main:1}, order: [ ['updatedAt', 'DESC'] ]});
    var usedPages = [];
	for(let k = 0; k < rows.length; k++)
	{usedPages.push(rows[k]['serviceTitleId']);}
	usedPages = Array.from(new Set(usedPages));
	const pages = await ServicePages.findAll({
		where: { id: {[Op.notIn]: usedPages},for_main: 1 },
	});
    res.render("mainServicePage", {
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
	const row  = await MainServiceSettings.findOne({ where: {id: getId}, include: [ServicePages] });
	res.render("mainServicePage", {
		title:  	"View "+title,
		page:   	page,
		pageUrl: 	pageUrl,
		metaTitle:  metaTitle,
        action: 	action,
		row:		row
	});
};

const editFaq = async (req, res) => {
	var action = req.query.action;
	// var getId  = req.query.id;
    const faqs = await ServiceFaq.findAll({ where: {show_in_main: 1} });
	// const row  = await MainServiceSettings.findOne({ where: {id: getId}, include: [ServicePages] });
	res.render("mainServicePage", {
		title:  	"View "+title,
		page:   	page,
		pageUrl: 	pageUrl,
		metaTitle:  metaTitle,
        action: 	action,
        faqs: faqs
		// row:		row
	});
};
  
const edit = async (req, res) => {
	var action = req.query.action;
	var getId  = req.query.id;
    const pages= await ServicePages.findAll({ where: {for_main: 1}});
	const row  = await MainServiceSettings.findOne({ where: {id: getId} });
    res.render("mainServicePage", {
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
	await MainServiceSettings.destroy({ where: {id: getId}});
	triggerRevalidate(["all-services", "meta:services"], ["/services", "/"]);
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
            case "editFaq":
                editFaq(req, res);
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
            for_main: 1,
        };

        if(id && id != '')
        {
            await MainServiceSettings.update(formData, {where: {id: id}});
            await req.flash("success", "Service Page Title updated successfully.");
        }
        else
        {
            await MainServiceSettings.create(formData);
            await req.flash("success", "Service Page Title created successfully.");
        }
        triggerRevalidate(["all-services", "meta:services"], ["/services", "/"]);
        res.redirect(siteUrl + "/" + pageUrl);
	},

    storeFaq: async function(req, res) {

        const request = req.body;
			const faqsQue  = request.question ? request.question : [];

			if(faqsQue && faqsQue.length > 0)
			{
                await ServiceFaq.destroy({ where: {show_in_main: 1}});
				for(let i = 0; i < faqsQue.length; i++)
				{
					const faqsData = {
						question:	request.question[i],
						answer:		request.answer[i],
						show_in_main: 1,
						order_no:	request.order_no[i] ? request.order_no[i] : 1
					};
					await ServiceFaq.create(faqsData);
                    console.log("Data Apended");
				}
                await req.flash("success", "FAQ's updated successfully.");
			}
	
			triggerRevalidate(["all-services", "faqs", "meta:services"], ["/services", "/faq", "/"]);
			res.redirect(siteUrl + "/" + pageUrl +"?action=edit&id=6");
	},

};
