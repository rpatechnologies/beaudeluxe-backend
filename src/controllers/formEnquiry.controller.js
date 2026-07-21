const { body, validationResult } = require('express-validator');
var multer = require("multer");
const { createSlug } = require("../utils/global.helper");
const models = require("../models");
const Formappointment = models.appointmentForm;
const Formservices = models.formServices;
const Service = models.service;
const Subservice = models.subServices
const Job = models.job;


const title 	= "Form Enquiry";
const page  	= "form_enquiry";
const pageUrl   = "form_enquiry";
const metaTitle = siteName + " | Form Enquiries";

const list = async (req, res) => {
    var action = req.query.action;
    var rows   = await Formappointment.findAll({ where: {}, order: [ ['id', 'DESC'] ]});
    res.render("form_enquiry", {
        title:  	"Form Enquiries",
        page:   	page,
        pageUrl: 	pageUrl,
        metaTitle:  metaTitle,
        action: 	action,
        rows:		rows
    });
};

const view = async (req, res) => {
    var action = req.query.action;
    var getId  = req.query.id;
    const row  = await Formappointment.findOne({ where: {id: getId} });
    const services = await Formservices.findAll({where : {form_id : getId}, 
        include:[
            {
                model: Service,
                as: 'service',
            },
            {
                model: Subservice,
                as: 'sub_service',
            }
        ]
        
    });
    res.render("form_enquiry", {
        title:  	"View "+title,
        page:   	page,
        pageUrl: 	pageUrl,
        metaTitle:  metaTitle,
        action: 	action,
        services:   services,
        row:		row
    });
};

const destroy = async (req, res) => {
    var getId  = req.query.id;
    await Formappointment.destroy({ where: {id: getId}});
    await req.flash("success", "Form enquiry deleted successfully.");
    res.redirect(siteUrl + "/" + pageUrl);
};

module.exports = {

    index: async function (req, res) {
        var action = req.query.action;
        switch (action) {
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

    // store: async function store(req, res) {

    //     var storage = multer.diskStorage({
    //     });
    //     const initUpload = multer({ storage: storage });
    //     const uploadMiddleware = initUpload.fields([
    //     ]);
    //     uploadMiddleware(req, res, async () => {
    //         const errors = validationResult(req);
    //         if (!errors.isEmpty()) {
    //             req.flash("error", errors.array()[0].msg);
    //             res.redirect('back');
    //             return;
    //         }

    //         const {id, } = req.body;

    //         const formData = {
    //             location_id: 	      location_id,
    //             title: 		          title,
    //             career_enquiry_type:  career_enquiry_type,
    //             status: 	          status
    //         };

    //         if(id && id != '')
    //         {
    //             await Job.update(formData, {where: {id: id}});
    //             await req.flash("success", "Job updated successfully.");
    //         }
    //         else
    //         {
    //             formData.slug = createSlug(title);

    //             await Job.create(formData);
    //             await req.flash("success", "Job created successfully.");
    //         }
    //         res.redirect(siteUrl + "/" + pageUrl);
    //     });
    // },
};
