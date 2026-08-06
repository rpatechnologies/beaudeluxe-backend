const { body, validationResult } = require('express-validator');
var multer = require("multer");
const { createSlug } = require("../utils/global.helper");
const models = require("../models");
const GiftVoucher = models.giftVouchers;
const fs = require("fs");

const { processAndConvertImageToWebp } = require("../utils/image.helper");
const title 	= "Gift Voucher";
const page  	= "gift_voucher";
const pageUrl   = "gift_voucher";
const metaTitle = siteName + "gift_voucher";

const list = async (req, res) => {
    var action = req.query.action;
    var rows   = await GiftVoucher.findAll({ where: {}, order: [ ['id', 'DESC'] ]});
    res.render("giftVoucher", {
        title:  	title+"s",
        page:   	page,
        pageUrl: 	pageUrl,
        metaTitle:  metaTitle,
        action: 	action,
        rows:		rows || []
    });
};
  
const add = async (req, res) => {
    var action = req.query.action;
    res.render("giftVoucher", {
        title:  	"Add "+title,
        page:   	page,
        pageUrl: 	pageUrl,
        metaTitle:  metaTitle,
        action: 	action,
        row:		[], 
    });
};

const view = async (req, res) => {
    var action = req.query.action;
    var getId  = req.query.id;
    const row  = await GiftVoucher.findOne({ where: {id: getId} }); 
    res.render("giftVoucher", {
        title:  	"View "+title,
        page:   	page,
        pageUrl: 	pageUrl,
        metaTitle:  metaTitle,
        action: 	action,
        row:		row,
    });
};
  
const edit = async (req, res) => {
    var getId  = req.query.id;
    var action = req.query.action;
    const row  = await GiftVoucher.findOne({ where: {id: getId} });
    res.render("giftVoucher", {
        title:  	"Edit "+title,
        page:   	page,
        pageUrl: 	pageUrl,
        action: 	action,
        metaTitle:  metaTitle,
        row:		row,
    });
};

const destroy = async (req, res) => {
    var getId  = req.query.id;
    await GiftVoucher.destroy({ where: {id: getId}});
    await req.flash("success", "Gift Voucher deleted successfully.");
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

        var dirForUpload = "./public/uploads/gift_voucher/";
        if (!fs.existsSync(dirForUpload)) {
            fs.mkdirSync(dirForUpload);
        }

        var storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, "./public/uploads/gift_voucher/");
            },
            filename: function (req, file, callback) {
                callback(null, Date.now() + "-" + file.originalname);
            },
        });

        const initUpload = multer({ storage: storage });
        const uploadMiddleware = initUpload.fields([
            { name: "image", maxCount: 1 },
        ]);
        uploadMiddleware(req, res, async () => {
            await body('title','Title is required.').notEmpty().run(req);

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                req.flash("error", errors.array()[0].msg);
                res.redirect('back');
                return;
            } 

            const { id, title, description, image_old, status } = req.body;
            let image = image_old;
            if (req.files && req.files.image && req.files.image[0]) {
                image = await processAndConvertImageToWebp(req.files.image[0], "./public/uploads/gift_voucher/");
            }
    
            const formData = {
                title : title,
                description : description,
                image : image,
                status : status,
            };

            if(id && id != '')
            {
                await GiftVoucher.update(formData, {where: {id: id}});
                await req.flash("success", "GiftVoucher updated successfully.");
            }
            else
            {
                var isExists   = await GiftVoucher.findOne({ where: {title:title}});

                if(isExists){
                await req.flash("error", "GiftVoucher already Exists.");
                }else{

                const record = await GiftVoucher.create(formData);

                await req.flash("success", "GiftVoucher created successfully.");
            }
            }
            res.redirect(siteUrl + "/" + pageUrl);
        });
    },
};
