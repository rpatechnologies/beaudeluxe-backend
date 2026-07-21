const { body, validationResult } = require('express-validator');
const models = require("../models");
const formsModel   = models.forms;
const formContent = models.formContent;
var multer = require("multer");
const fs = require("fs");

const title 	= "Form Content";
const page  	= "form_content";
const pageUrl   = "form_content";
const metaTitle = siteName + " | Form Content";

const list = async (req, res) => {
    var action = req.query.action;
	var rows   = await formContent.findAll({ where: {}, include: [formsModel], order: [ ['id', 'ASC'] ]});
    // console.log(rows);
    res.render("formContent", {
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
	const pages = await formsModel.findAll();
    res.render("formContent", {
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
    const pages = await formsModel.findAll();
	const row  = await formContent.findOne({ where: {id: getId} });
	res.render("formContent", {
		title:  	"View "+title,
		page:   	page,
		pageUrl: 	pageUrl,
		metaTitle:  metaTitle,
        action: 	action,
        pages:		pages,
		row:		row
	});
};
  
const edit = async (req, res) => {
	var action = req.query.action;
	var getId  = req.query.id;
    const pages = await formsModel.findAll();
    const row  = await formContent.findOne({ where: {id: getId} });
    res.render("formContent", {
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
            await body('title','Title is required.').notEmpty().run(req);
        await body('name_label','Name label is required.').notEmpty().run(req);
        await body('email_label','Email label is required.').notEmpty().run(req);
        // await body('phone_label','Phone label is required.').notEmpty().run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash("error", errors.array()[0].msg);
            res.redirect('back');
            return;
        }

        const request = req.body;

        // if(!imageData && request.page_id!=3){
        //     req.flash("error", "Please Upload the required Images");
        //     res.redirect('back');
        //     return;
        // }

        var formData = {
            // id, title, shadow_title, name_label, phone_label, email_label, start_date, location_label, message_label
            title:	          request.title,
            shadow_title:	  request.shadow_title,
            page_id:		  request.page_id,
            date_label:       request.date_label,
            slot_label:       request.slot_label,
            service_label:    request.service_label,
            subservice_label: request.service_label,
            name_label:	      request.name_label, 
            phone_label:	  request.phone_label, 
            email_label:	  request.email_label,
            location_label:	  request.location_label,
        }
        // if(request.id == 1)
        // {
        //     formData.subject_label   = request.subject_label;
        //     formData.company_label   = request.company_label;
        //     formData.job_title_label = request.job_title_label;
        //     formData.message_label   = request.message_label;
        // }
        // else if(request.id == 2)
        // {
        //     formData.cv_label   = request.cv_label;
        // }

        await formContent.update(formData, {where: {id: request.id}});
        await req.flash("success", "Form content updated successfully.");

        res.redirect(siteUrl + "/" + pageUrl);
        });
        
	},
};
