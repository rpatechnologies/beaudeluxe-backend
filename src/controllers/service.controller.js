const { body, validationResult } = require('express-validator');
var multer = require("multer");
const { createSlug } = require("../utils/global.helper");
const models = require("../models");
const Service = models.service;
const ServiceFaq = models.serviceFaq;
const SubServices = models.subServices;
const ServiceImage = models.serviceImage;
const fs = require("fs");

const title 	= "Service";
const page  	= "service";
const pageUrl   = "service";
const metaTitle = siteName + " | Service";

const list = async (req, res) => {
    var action = req.query.action;
	var rows   = await Service.findAll({ where: {}, order: [ ['id', 'DESC'] ], attributes: ['id', 'title', 'short_description', 'heading', 'image', 'altTag', 'logo', 'altTagLogo', 'updatedAt', 'status', 'show_in_menu', 'altTagBanner', 'show_on_home', 'altTagBannerMob', 'slug']});
    res.render("service", {
        title:  	title+"s",
        page:   	page,
		pageUrl: 	pageUrl,
		metaTitle:  metaTitle,
        action: 	action,
		// faqs:		faqs,
        rows:		rows
    });
};
  
const add = async (req, res) => {
    var action = req.query.action;
	const service = await Service.findAll();
    res.render("service", {
		title:  	"Add "+title,
		page:   	page,
		pageUrl: 	pageUrl,
		metaTitle:  metaTitle,
        action: 	action,
		row:		[],
		images: 	[],
		faqs:		[],
		subServices: [],
		service: 	service,
    });
};

const view = async (req, res) => {
	var action = req.query.action;
	var getId  = req.query.id;
	const row  = await Service.findOne({ where: {id: getId} });
	const faqs = await ServiceFaq.findAll({ where: {service_id: getId} });
	const subServices = await SubServices.findAll({ where: {service_id: getId} });
	res.render("service", {
		title:  	"View "+title,
		page:   	page,
		pageUrl: 	pageUrl,
		metaTitle:  metaTitle,
        action: 	action,
		images: 	[],
		faqs: 		faqs,
		subServices: subServices,
		row:		row,
		// details:	[]
	});
};
  
const edit = async (req, res) => {
	var action = req.query.action;
	var getId  = req.query.id;
	const row  = await Service.findOne({ where: {id: getId} });
	const currentService = await Service.findOne({ where: {id: getId} });
	const faqs = await ServiceFaq.findAll({ where: {service_id: getId} });
	const subServices = await SubServices.findAll({ where: {service_id: getId} });
	const images   = await ServiceImage.findAll({ where: {service_id: getId} });
	// console.log(images);
    res.render("service", {
		title:  	"Edit "+title,
		page:   	page,
		pageUrl: 	pageUrl,
		metaTitle:  metaTitle,
		images:     images,
        action: 	action,
		faqs:		faqs,
		subServices:subServices,
		row:		row,
		// details:	[]
    });
};

const deleteImg = async (req, res) => {
	var getId  = req.query.id;
	var getSerId = req.query.img_id;
	await Service.sequelize.query("SET FOREIGN_KEY_CHECKS = 0", null);
	await ServiceImage.destroy({ where: {id: getSerId}});
	await Service.sequelize.query("SET FOREIGN_KEY_CHECKS = 1", null);
	await req.flash("success", "Image deleted successfully.");
	res.redirect(siteUrl + "/" + pageUrl + "?action=edit&id="+getId);
	// +"?action=edit&id="+getId
};

const destroy = async (req, res) => {
	var getId  = req.query.id;
	await Service.sequelize.query("SET FOREIGN_KEY_CHECKS = 0", null);
	await Service.destroy({ where: {id: getId}});
	await Service.sequelize.query("SET FOREIGN_KEY_CHECKS = 1", null);
	await req.flash("success", "Service deleted successfully.");
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
			case "deleteImg":
				deleteImg(req, res);
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
		var storage = multer.diskStorage({
            destination: function (req, file, callback) {
				if(file.fieldname === "image"|| file.fieldname === "logo") {
					callback(null, "./public/uploads/service/");
				} else if(file.fieldname === "banner" || file.fieldname === "banner_mob") {
					callback(null, "./public/uploads/service/banners/");
				} else if(file.fieldname === "bannerImages") {
					callback(null, "./public/uploads/service/banners/");
				}
            },
            filename: function (req, file, callback) {
                callback(null, Date.now() + "-" + file.originalname);
            },
        });

        const initUpload = multer({ storage: storage });
        const uploadMiddleware = initUpload.fields([
            { name: "image", maxCount: 1 },
            { name: "banner", maxCount: 1 },
			{ name: "logo", maxCount: 1 },
        ]);
        uploadMiddleware(req, res, async () => {
			await body('title','Title is required.').notEmpty().run(req);
			// await body('short_description','Short description is required.').notEmpty().run(req);
			// await body('heading','Heading is required.').notEmpty().run(req);
			// await body('description','Description is required.').notEmpty().run(req);

			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				req.flash("error", errors.array()[0].msg);
				res.redirect('back');
				return;
			} 

			const request = req.body;
			const {id, title, short_description, heading,order_number, description, image_old, altTag, logo_old, altTagLogo, sub_services_description, details_heading, meta_title, meta_description, meta_keywords, status, banner_old, altTagBanner, banner_mob_old, altTagBannerMob, show_in_menu, show_on_home } = req.body;
			const image = req.files && req.files.image ? req.files.image[0].filename : image_old;
			const banner = req.files && req.files.banner ? req.files.banner[0].filename : banner_old;
			const bannerMob = req.files && req.files.banner_mob ? req.files.banner_mob[0].filename : banner_mob_old;
			const faqsQue  = request.question ? request.question : [];
			const subServiceTitle  = request.subServiceTitle ? request.subServiceTitle : [];
			const logo = req.files && req.files.logo ? req.files.logo[0].filename : logo_old;
			const images   = req.files ? req.files.bannerImages : [];
			const orderOfImages  = request.orderOfImages ? request.orderOfImages : [];

			const formData = {
				title: 				title,
				short_description: 	short_description,
				heading: 			heading,
				description: 		description,
				image: 				image,
				order_number:       order_number,
				altTag:				altTag,
				logo:				logo,
				altTagLogo:			altTagLogo,
				banner: 			banner,
				altTagBanner:		altTagBanner,
				banner_mob: 		bannerMob,
				altTagBannerMob:	altTagBannerMob,
				sub_services_description: sub_services_description,
				details_heading: 	details_heading,
				meta_title: 		meta_title,
				meta_description: 	meta_description,
				meta_keywords: 		meta_keywords,
				status: 			status,
				show_in_menu:		show_in_menu,
				show_on_home:		show_on_home
			};
			if(id && id != '')
			{
				if(subServiceTitle && subServiceTitle.length > 0)
				{
					await SubServices.destroy({ where: {service_id: id}});
					for(let i = 0; i < subServiceTitle.length; i++)
					{
						const subService = {
							service_id:	id,
							title:	request.subServiceTitle[i],
							order_no:	request.order_no_ss[i] ? request.order_no_ss[i] : 1
						};
						await SubServices.create(subService);
					}
				}

				if(images && images.length > 0) 
				{
					for(let j = 0; j < images.length; j++)
					{
						const item = images[j];
						var imgData = {}
						if(orderOfImages.length>0){
							imgData["service_id"] = id;
							imgData["image"] = item.filename;
							imgData["order_no"] = 1;
						}else{
							imgData["service_id"] = id;
							imgData["image"] = item.filename;
							imgData["order_no"] = 1;
						}
						await ServiceImage.create(imgData);
					}
				}

				if(faqsQue && faqsQue.length > 0)
				{
					await ServiceFaq.destroy({ where: {service_id: id}});
					for(let i = 0; i < faqsQue.length; i++)
					{
						const faqsData = {
							service_id:	id,
							question:	request.question[i],
							answer:		request.answer[i],
							show_in_main: 0,
							order_no:	request.order_no[i] ? request.order_no[i] : 1
						};
						await ServiceFaq.create(faqsData);
					}
				}
				await Service.update(formData, {where: {id: id}});
				await req.flash("success", "Service updated successfully.");
			}
			else
			{
				formData.slug = createSlug(title);

				var isExists   = await Service.findOne({ where: {title:title}});

				if(isExists){
				await req.flash("error", "Service already Exists.");
				}else{
				
				const record = await Service.create(formData);

				if(subServiceTitle && subServiceTitle.length > 0)
			{
				// await SubServices.destroy({ where: {service_id: record['id']}});
				for(let i = 0; i < subServiceTitle.length; i++)
				{
					const subService = {
						service_id:	record['id'],
						title:	request.subServiceTitle[i],
						order_no:	request.order_no_ss[i] ? request.order_no_ss[i] : 1
					};
					await SubServices.create(subService);
				}
			}

			if(images && images.length > 0) 
			{
				for(let j = 0; j < images.length; j++)
				{
					const item = images[j];
					var imgData = {}
					if(orderOfImages.length>0){
						imgData["service_id"] = record['id'];
						imgData["image"] = item.filename;
						imgData["order_no"] = 1;
					}else{
						imgData["service_id"] = record['id'];
						imgData["image"] = item.filename;
						imgData["order_no"] = 1;
					}
					// const imgData = {
					// 	service_id:		id,
					// 	image:			item.filename,
					// 	// order_no:  1,
					// 	order_no: 		request.orderOfImages[j]?request.orderOfImages[j]:1
					// };
					await ServiceImage.create(imgData);
				}
			}

			if(faqsQue && faqsQue.length > 0)
			{
				// await ServiceFaq.destroy({ where: {service_id: record['id']}});
				for(let i = 0; i < faqsQue.length; i++)
				{
					const faqsData = {
						service_id:	record['id'],
						question:	request.question[i],
						answer:		request.answer[i],
						show_in_main: 0,
						order_no:	request.order_no[i] ? request.order_no[i] : 1
					};
					await ServiceFaq.create(faqsData);
				}
			}

				await req.flash("success", "Service created successfully.");
			}
			
		 	}

			 res.redirect(siteUrl + "/" + pageUrl);
		});
	}catch(e){
		console.log(e);}
	},
};
