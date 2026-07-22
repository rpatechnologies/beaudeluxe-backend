const { body, validationResult } = require('express-validator');
const fs = require('fs');
var multer = require("multer");
const bcrypt = require("bcrypt");
const models = require("../models");
const Admin = models.admin;
const Contact = models.getInTouch;
const Quotations = models.quotations;
const Service = models.service;
const Countries = models.country;
const FormEnquiry = models.appointmentForm;
const moment = require('moment-timezone');

const upload = require("../middlewares/upload");
const cache = require("memory-cache");
const { where } = require('sequelize');

module.exports = {

    dashboard: async function (req, res) {
      
        const serviceCount = await Service.count({});
        const contactCount = await FormEnquiry.count({});
        const dash = {
            serviceCount: serviceCount ? serviceCount : 0,
            contactCount: contactCount ? contactCount : 0,
        }
        
        var rows = await FormEnquiry.findAll({where : {},attributes: ['name', 'email_address','location', 'phone_number', 'date', 'amount', 'createdAt'], order: [['id', 'DESC']] , limit: 5 })
    
        res.render("dashboard", {
            metaTitle: siteName + " - Dashboard", 
            title: "Dashboard", 
            page: "dashboard", 
            dash:  dash,
            rows:  rows ? rows : [],
        });
    },

    profile: async function (req, res) {
        const admin = await Admin.findOne({ where: {id : req.session.admin_id} });
        res.render("profile", {metaTitle: siteName + " - My Profile", title: "My Profile", page: "profile", data: admin});
    },

    profilePost: async function (req, res) {
        var dirForUpload = "./public/uploads/admin/";
		if (!fs.existsSync(dirForUpload)) {
			fs.mkdirSync(dirForUpload);
		}
        var formRequest = multer({
            storage: upload.files.storage("./public/uploads/admin/"),
            allowedFiles: upload.files.allowedFiles,
        }).single("avatar");
        formRequest(req, res, async () => {

            const request = req.body;

            await body('name','Full name is required.').notEmpty().run(req);
            await body('contact_number','Phone number is required.').notEmpty().run(req);

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                req.flash("error", errors.array()[0].msg);
                res.redirect('back');
                return;
            }

            const fileName = req.file ? req.file.filename : request.avatar_old;

            const formobj = {
                name:   request.name,
                contact_number:   request.contact_number,
                avatar:   fileName
            }

            await Admin.update(formobj, {where: {id: req.session.admin_id}})

            await req.flash("success", "Profile updated successfully.");
            res.redirect(siteUrl + "/profile");
        });
    },

    changeAdminId: async function (req, res) {
        
        const request = req.body;

        await body('newId','New Email Id is required.').notEmpty().run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash("error", errors.array()[0].msg);
            res.redirect('back');
            return;
        }

        const formobj = { email:   request.newId }

        await Admin.update(formobj, {where: {id: req.session.admin_id}})

        await req.flash("success", "Admin Email Id updated successfully.");
        req.session.destroy();
        res.redirect("/");
        // res.redirect(siteUrl + "/profile");

    },

    password: async function (req, res) {
        res.render("password", {metaTitle: siteName + " - Change Password", title: "Change Password", page: "password"});
    },

    changePassword: async function ChangePassword(req, res) {

        const { old_password, new_password, password } = req.body

        await body('new_password','New password is required.').notEmpty().run(req);
        await body('password','Confirm password is required.').notEmpty().run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash("error", errors.array()[0].msg);
            res.redirect('back');
            return;
        }

        const admin = await Admin.findOne({ where: {id : req.session.admin_id} });

        if (new_password != password) 
        {
            await req.flash("error", "Confirm password does not match");
            res.redirect('back');
            return;
        }
     
        const formobj = {
            password: await bcrypt.hash(password, 10)
        }

        await Admin.update(formobj, {where: {id: req.session.admin_id}})
 
        await req.flash("success", "Password updated successfully.");
        res.redirect(siteUrl + "/password");
        // req.session.destroy();
        // res.redirect("/");
    },
    clearHomeCache: async function (req, res) {
        const cacheKey = "home_content_cache"; 
        cache.del(cacheKey);
        await req.flash("success", "Cache clear successfully.");
        res.redirect("/dashboard");
      },
};
