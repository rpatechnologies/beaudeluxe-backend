const { body, validationResult } = require('express-validator');
const models = require("../models");
const emailTemplate = models.emailTemplate;

const title 	= "Email Template";
const page  	= "email_template";
const pageUrl   = "email_template";
const metaTitle = siteName + " | Email Template";

const list = async (req, res) => {
    var action = req.query.action;
	var rows   = await emailTemplate.findAll({});
    res.render("emailTemplate", {
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
    res.render("emailTemplate", {
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
	const row = await emailTemplate.findOne({ where: {id: getId} });
	res.render("emailTemplate", {
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
	const row = await emailTemplate.findOne({ where: {id: getId} });
    res.render("emailTemplate", {
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
	await emailTemplate.destroy({ where: {id: getId}});
	await req.flash("success", "Email template deleted successfully.");
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

		await body('type','Email type is required.').notEmpty().run(req);
		await body('from_name','From name is required.').notEmpty().run(req);
		await body('from_email','From email is required.').isEmail().normalizeEmail().run(req);
		await body('subject','Subject is required.').notEmpty().run(req);
		await body('content','Content is required.').notEmpty().run(req);

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			req.flash("error", errors.array()[0].msg);
			res.redirect('back');
			return;
		}

		const {id, type, from_name, from_email, subject, content, status} = req.body;

		const formData = {
			type: 		type,
			from_name: 	from_name,
			from_email:	from_email,
			subject: 	subject,
			content: 	content,
			status: 	status
		};

		if(id && id != '')
		{
			await emailTemplate.update(formData, {where: {id: id}});
			await req.flash("success", "Email template updated successfully.");
		}
		else
		{
			await emailTemplate.create(formData);
			await req.flash("success", "Email template created successfully.");
		}
		res.redirect(siteUrl + "/" + pageUrl);
	},
};
