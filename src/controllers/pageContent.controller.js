const { body, validationResult } = require('express-validator');
var multer = require("multer");
const models = require("../models");
const pageModel   = models.page;
const pageContent = models.pageContent;

const title 	= "Page Content";
const page  	= "page_content";
const pageUrl   = "page_content";
const metaTitle = siteName + " | Page Content";

const list = async (req, res) => {
    var action = req.query.action;
	var rows   = await pageContent.findAll({ where: {}, include: [pageModel], order: [ ['id', 'DESC'] ]});
    res.render("pageContent", {
        title:  	title+"s",
        page:   	page,
		pageUrl: 	pageUrl,
		metaTitle:  metaTitle,
        action: 	action,
        rows:		rows
    });
};
  
const add = async (req, res) => {
    var action = req.query.action;
	const pages = await pageModel.findAll();
    res.render("pageContent", {
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
	const row  = await pageContent.findOne({ where: {id: getId}, include: [pageModel] });
	res.render("pageContent", {
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
	const pages= await pageModel.findAll();
	const row  = await pageContent.findOne({ where: {id: getId} });
    res.render("pageContent", {
		title:  	"Edit "+title,
		page:   	page,
		pageUrl: 	pageUrl,
		metaTitle:  metaTitle,
        action: 	action,
		pages:		pages,
		row:		row
    });
};

const destroy = async (req, res) => {
	var getId  = req.query.id;
	await pageContent.destroy({ where: {id: getId}});
	await req.flash("success", "Page content deleted successfully.");
	res.redirect(siteUrl + "/" + pageUrl);
};
const destroy2 = async(req,res)=>{
    var getId = req.query.id;
    await pageContent.destroy({ where : {id: getId}});
    await req.flash("Success", "Page content deleted successfully.");
    res.redirect(siteUrl + "/" + pageUrl);
}
 
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
        await body('heading','Heading is required.').notEmpty().run(req);
        await body('description','Description is required.').notEmpty().run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash("error", errors.array()[0].msg);
            res.redirect('back');
            return;
        }

        const {id, page_id, heading, description, status} = req.body;

        const formData = {
            page_id:	 page_id,
            heading:     heading,
            description: description,
            status: 	 status
        };

        if(id && id != '')
        {
            await pageContent.update(formData, {where: {id: id}});
            await req.flash("success", "Page content updated successfully.");
        }
        else
        {
            await pageContent.create(formData);
            await req.flash("success", "Page content created successfully.");
        }
        res.redirect(siteUrl + "/" + pageUrl);
	},
};
