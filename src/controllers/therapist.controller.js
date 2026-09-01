const { body, validationResult } = require('express-validator');
const fs = require('fs');
var multer = require("multer");
const models = require("../models");
const Therapist = models.therapist;
const HomePageContents = models.homePageContents;
const { homePageContentsData } = require("../utils/global.helper");
const cache = require("memory-cache");
const { revalidateNextCache } = require("../utils/revalidate.helper");

const { processAndConvertImageToWebp } = require("../utils/image.helper");
const title = "Our Teams";
const page = "our_teams";
const pageUrl = "our-teams";
const metaTitle = siteName + " - Our Teams Management";

async function updateFields(requestArray) {
    for (let i = 0; i < requestArray.length; i++) {
        const data = requestArray[i];
        const dataObj = { value: data.value };
        const exist = await HomePageContents.findOne({ where: { field: data.key } });
        if (exist) {
            await HomePageContents.update(dataObj, { where: { field: data.key } });
        } else {
            await HomePageContents.create({ field: data.key, value: data.value });
        }
    }
}

const list = async (req, res) => {
    var action = req.query.action;
    var rows = await Therapist.findAll({ order: [["order_number", "ASC"], ["id", "DESC"]] });
    res.render("therapist", {
        title: title,
        page: page,
        pageUrl: pageUrl,
        metaTitle: metaTitle,
        action: action,
        rows: rows
    });
};

const add = async (req, res) => {
    var action = req.query.action;
    res.render("therapist", {
        title: "Add " + title,
        page: page,
        pageUrl: pageUrl,
        metaTitle: metaTitle,
        action: action,
        row: {}
    });
};

const view = async (req, res) => {
    var action = req.query.action;
    var getId = req.query.id;
    const row = await Therapist.findOne({ where: { id: getId } });
    res.render("therapist", {
        title: "View " + title,
        page: page,
        pageUrl: pageUrl,
        metaTitle: metaTitle,
        action: action,
        row: row
    });
};

const edit = async (req, res) => {
    var action = req.query.action;
    var getId = req.query.id;
    const row = await Therapist.findOne({ where: { id: getId } });
    res.render("therapist", {
        title: "Edit " + title,
        page: page,
        pageUrl: pageUrl,
        metaTitle: metaTitle,
        action: action,
        row: row
    });
};

const destroy = async (req, res) => {
    var getId = req.query.id;
    await Therapist.destroy({ where: { id: getId } });
    cache.clear();
    revalidateNextCache({ tags: ["therapist-sections", "our-teams", "meta:therapist"], paths: ["/therapist", "/about-us"] });
    await req.flash("success", "Therapist deleted successfully.");
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
        var dirForUpload = "./public/uploads/therapist/";
        if (!fs.existsSync(dirForUpload)) {
            fs.mkdirSync(dirForUpload, { recursive: true });
        }

        var storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, "./public/uploads/therapist/");
            },
            filename: function (req, file, callback) {
                callback(null, Date.now() + "-" + file.originalname);
            },
        });

        const initUpload = multer({ storage: storage });
        const uploadMiddleware = initUpload.fields([
            { name: "image", maxCount: 1 }
        ]);

        uploadMiddleware(req, res, async () => {
            const { id, name, designation, experience, image_old, altTag, specializations, certifications, order_number, status } = req.body;

            let image = image_old;
            if (req.files && req.files.image && req.files.image[0]) {
                image = await processAndConvertImageToWebp(req.files.image[0], "./public/uploads/therapist/");
            }

            const formData = {
                name: name,
                designation: designation,
                experience: experience,
                image: image,
                altTag: altTag || "",
                specializations: specializations || "",
                certifications: certifications || "",
                order_number: order_number || 0,
                status: status !== undefined ? parseInt(status) : 1
            };

            if (id && id !== '') {
                await Therapist.update(formData, { where: { id: id } });
                await req.flash("success", "Therapist updated successfully.");
            } else {
                await Therapist.create(formData);
                await req.flash("success", "Therapist created successfully.");
            }

            cache.clear();
            revalidateNextCache({ tags: ["therapist-sections", "our-teams", "meta:therapist"], paths: ["/therapist", "/about-us"] });
            res.redirect(siteUrl + "/" + pageUrl);
        });
    },

    therapistFounder: async function (req, res) {
        const data = await homePageContentsData();
        res.render("therapistFounder", {
            metaTitle: siteName + " - Note from Founder",
            title: "Note from Founder",
            page: "therapist_founder",
            data: data
        });
    },

    therapistFounderPost: async function (req, res) {
        var dirForUpload = "./public/uploads/homepagecontents/";
        if (!fs.existsSync(dirForUpload)) {
            fs.mkdirSync(dirForUpload, { recursive: true });
        }
        var storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, "./public/uploads/homepagecontents/");
            },
            filename: function (req, file, callback) {
                callback(null, Date.now() + "-" + file.originalname);
            },
        });
        const initUpload = multer({ storage: storage });
        const uploadMiddleware = initUpload.fields([
            { name: "therapist_founder_image", maxCount: 1 }
        ]);

        uploadMiddleware(req, res, async () => {
            const {
                therapist_founder_title,
                therapist_founder_image_old,
                therapist_founder_quote,
                therapist_founder_name,
                therapist_founder_role
            } = req.body;

            let therapist_founder_image = therapist_founder_image_old;
            if (req.files && req.files.therapist_founder_image && req.files.therapist_founder_image[0]) {
                therapist_founder_image = await processAndConvertImageToWebp(req.files.therapist_founder_image[0], "./public/uploads/homepagecontents/");
            }

            let request = [];
            request.push({ key: "therapist_founder_title", value: therapist_founder_title });
            request.push({ key: "therapist_founder_image", value: therapist_founder_image });
            request.push({ key: "therapist_founder_quote", value: therapist_founder_quote });
            request.push({ key: "therapist_founder_name", value: therapist_founder_name });
            request.push({ key: "therapist_founder_role", value: therapist_founder_role });

            await updateFields(request);
            cache.clear();
            revalidateNextCache({ tags: ["therapist-sections", "our-teams", "meta:therapist"], paths: ["/therapist", "/about-us"] });
            await req.flash("success", "Note from Founder updated successfully.");
            res.redirect(siteUrl + "/therapist_founder");
        });
    },

    therapistSpecialization: async function (req, res) {
        const data = await homePageContentsData();
        res.render("therapistSpecialization", {
            metaTitle: siteName + " - Therapist Specializations",
            title: "Therapist Specializations",
            page: "therapist_specialization",
            data: data
        });
    },

    therapistSpecializationPost: async function (req, res) {
        const { therapist_specialization_title, therapist_specialization_description, card_index, card_title, card_desc, card_link } = req.body;

        let cardsList = [];
        if (card_index) {
            const indexArr = Array.isArray(card_index) ? card_index : [card_index];
            const titleArr = Array.isArray(card_title) ? card_title : [card_title];
            const descArr = Array.isArray(card_desc) ? card_desc : [card_desc];
            const linkArr = Array.isArray(card_link) ? card_link : [card_link];

            for (let i = 0; i < indexArr.length; i++) {
                cardsList.push({
                    id: parseInt(indexArr[i]),
                    title: titleArr[i],
                    description: descArr[i],
                    link_text: linkArr[i]
                });
            }
        }

        let request = [];
        request.push({ key: "therapist_specialization_title", value: therapist_specialization_title });
        request.push({ key: "therapist_specialization_description", value: therapist_specialization_description });
        request.push({ key: "therapist_specialization_cards", value: JSON.stringify(cardsList) });

        await updateFields(request);
        cache.clear();
        revalidateNextCache({ tags: ["therapist-sections", "our-teams", "meta:therapist"], paths: ["/therapist"] });
        await req.flash("success", "Specializations updated successfully.");
        res.redirect(siteUrl + "/therapist_specialization");
    },

};
