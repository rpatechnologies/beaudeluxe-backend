const { body, validationResult } = require('express-validator');
var multer = require("multer");
const models = require("../models");
const Faq = models.faq;

const title 	= "Faq";
const page  	= "faq";
const pageUrl   = "faq";
const metaTitle = siteName + " | Faq";

const list = async (req, res) => {
    var action = req.query.action;
    var rows   = await Faq.findAll({ where: {}, order: [ ['id', 'ASC'] ]});
    res.render("faq", {
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
    res.render("faq", {
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
    const row  = await Faq.findOne({ where: {id: getId} });
    res.render("faq", {
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
    const row  = await Faq.findOne({ where: {id: getId} });
    res.render("faq", {
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
    await Faq.destroy({ where: {id: getId}});
    await req.flash("success", "Faq deleted successfully.");
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
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash("error", errors.array()[0].msg);
            res.redirect('back');
            return;
        }

        const {id, slug, answer, question, category, show_on_homepage, status} = req.body;
        const formData = {
            slug: slug,
            answer: answer,
            question: question,
            category: category || "About",
            show_on_homepage: show_on_homepage,
            status: status
        };

        if(id && id != '')
        {
            await Faq.update(formData, {where: {id: id}});
            await req.flash("success", "Faq updated successfully.");
        }
        else
        {
            await Faq.create(formData);
            await req.flash("success", "Faq created successfully.");
        }
        res.redirect(siteUrl + "/" + pageUrl);
    },
};
