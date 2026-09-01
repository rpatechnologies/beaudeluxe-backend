const { body, validationResult } = require('express-validator');
const fs = require('fs');
var multer = require("multer");
const db = require("../models");
const Setting = db.setting;
const { settingData } = require("../utils/global.helper");
const { revalidateAll } = require("../utils/revalidate.helper");

const { processAndConvertImageToWebp } = require("../utils/image.helper");

module.exports = {

    general: async function (req, res) {
        const data = await settingData();
        res.render("generalSetting", { metaTitle: siteName + " - General Settings", title: "General Settings", page: "general", data: data });
    },

    smtp: async function (req, res) {
        const data = await settingData();
        res.render("smtpSetting", { metaTitle: siteName + " - SMTP Settings", title: "SMTP Settings", page: "smtp", data: data });
    },

    generalPost: async function (req, res) {
        var storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, "./public/uploads/info/");
            },
            filename: function (req, file, callback) {
                callback(null, Date.now() + "-" + file.originalname);
            },
        });
        const initUpload = multer({ storage: storage });
        const uploadMiddleware = initUpload.fields([
            { name: "logo", maxCount: 1 },
            { name: "footer_logo", maxCount: 1 },
            { name: "favicon", maxCount: 1 },
            { name: "partner_icon", maxCount: 1 },
        ]);
        uploadMiddleware(req, res, async () => {
            const { email, career_email, contact, address, meta_title, meta_description, meta_keywords, logo_old, altTagHeaderLogo, footer_logo_old, altTagFooterLogo, favicon_old, altTagFavicon, partner_icon_old, alt_tag_partner_icon, facebook, twitter, instagram, linkedin, hotline_text, copyright_text, about_text_footer, mails_to } = req.body;
            let logo = logo_old;
            if (req.files && req.files.logo && req.files.logo[0]) {
                logo = await processAndConvertImageToWebp(req.files.logo[0], "./public/uploads/info/");
            }
            let footerLogo = footer_logo_old;
            if (req.files && req.files.footer_logo && req.files.footer_logo[0]) {
                footerLogo = await processAndConvertImageToWebp(req.files.footer_logo[0], "./public/uploads/info/");
            }
            let favicon = favicon_old;
            if (req.files && req.files.favicon && req.files.favicon[0]) {
                favicon = await processAndConvertImageToWebp(req.files.favicon[0], "./public/uploads/info/");
            }
            let partner_icon = partner_icon_old;
            if (req.files && req.files.partner_icon && req.files.partner_icon[0]) {
                partner_icon = await processAndConvertImageToWebp(req.files.partner_icon[0], "./public/uploads/info/");
            }

            let request = [];
            request.push({ key: "email", value: email });
            request.push({ key: "career_email", value: career_email });
            request.push({ key: "contact", value: contact });
            request.push({ key: "address", value: address });
            request.push({ key: "logo", value: logo });
            request.push({ key: "altTagHeaderLogo", value: altTagHeaderLogo });
            request.push({ key: "footer_logo", value: footerLogo });
            request.push({ key: "altTagFooterLogo", value: altTagFooterLogo });
            request.push({ key: "favicon", value: favicon });
            request.push({ key: "altTagFavicon", value: altTagFavicon });
            request.push({ key: "partner_icon", value: partner_icon });
            request.push({ key: "alt_tag_partner_icon", value: alt_tag_partner_icon });
            request.push({ key: "meta_title", value: meta_title });
            request.push({ key: "meta_description", value: meta_description });
            request.push({ key: "meta_keywords", value: meta_keywords });
            request.push({ key: "twitter", value: twitter });
            request.push({ key: "instagram", value: instagram });
            request.push({ key: "linkedin", value: linkedin });
            request.push({ key: "hotline_text", value: hotline_text });
            request.push({ key: "copyright_text", value: copyright_text });
            request.push({ key: "about_text_footer", value: about_text_footer });
            request.push({ key: "mails_to", value: mails_to });

            for (let i = 0; i < request.length; i++) {
                const data = request[i];
                const dataObj = { value: data.value };
                const [affectedRows] = await Setting.update(dataObj, { where: { field: data.key } });
                if (affectedRows === 0) {
                    await Setting.create({ field: data.key, value: data.value });
                }
            }

            await req.flash("success", "General settings updated successfully.");
            revalidateAll();
            res.redirect(siteUrl + "/general_setting");
        });
    },

    smtpPost: async function (req, res) {
        const { smtp_host, smtp_port, smtp_username, smtp_password } = req.body;

        let request = [];
        request.push({ key: "smtp_host", value: smtp_host });
        request.push({ key: "smtp_port", value: smtp_port });
        request.push({ key: "smtp_username", value: smtp_username });
        request.push({ key: "smtp_password", value: smtp_password });

        for (let i = 0; i < request.length; i++) {
            const data = request[i];
            const dataObj = { value: data.value };
            const [affectedRows] = await Setting.update(dataObj, { where: { field: data.key } });
            if (affectedRows === 0) {
                await Setting.create({ field: data.key, value: data.value });
            }
        }

        await req.flash("success", "SMTP settings updated successfully.");
        res.redirect(siteUrl + "/smtp_setting");
    },
};
