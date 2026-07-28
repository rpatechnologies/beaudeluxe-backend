const { body, validationResult } = require('express-validator');
const fs = require('fs');
var multer = require("multer");
const db = require("../models");
const HomePageContents = db.homePageContents;
const { homePageContentsData } = require("../utils/global.helper");
const cache = require("memory-cache");

module.exports = {

    homePageContents: async function (req, res) {
        const data = await homePageContentsData();
        res.render("homePageContents", { metaTitle: siteName + " - Home Page Contents", title: "Home Page Contents", page: "home_page_contents", data: data });
    },

    homePageContentsPost: async function (req, res) {
        var dirForUpload = "./public/uploads/homepagecontents/";
        if (!fs.existsSync(dirForUpload)) {
            fs.mkdirSync(dirForUpload);
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
            { name: "screen_two_image", maxCount: 1 },
            { name: "screen_four_image", maxCount: 1 },
            { name: "home_banner_video", maxCount: 1 }
        ]);
        uploadMiddleware(req, res, async () => {
            const { welcome_banner_button_one_title, welcome_banner_button_two_title, welcome_banner_button_two_link, screen_one_title, screen_one_shadow_title, screen_two_title, screen_two_shadow_title, screen_two_inner_title, screen_two_description, screen_two_image_old, screen_two_image_alt_tag, screen_three_title, screen_three_shadow_title, screen_four_title, screen_four_shadow_title, screen_four_image_old, screen_four_image_alt_tag, banner_screen_title, banner_screen_shadow_title, screen_faq_title, screen_faq_shadow_title, animation_content, home_banner_video_old } = req.body;
            const screen_two_image = req.files && req.files.screen_two_image ? req.files.screen_two_image[0].filename : screen_two_image_old;
            const home_banner_video = req.files && req.files.home_banner_video ? req.files.home_banner_video[0].filename : home_banner_video_old;
            const screen_four_image = req.files && req.files.screen_four_image ? req.files.screen_four_image[0].filename : screen_four_image_old;

            let request = [];
            request.push({ key: "welcome_banner_button_one_title", value: welcome_banner_button_one_title });
            request.push({ key: "welcome_banner_button_two_title", value: welcome_banner_button_two_title });
            request.push({ key: "welcome_banner_button_two_link", value: welcome_banner_button_two_link });
            request.push({ key: "screen_one_title", value: screen_one_title });
            request.push({ key: "screen_one_shadow_title", value: screen_one_shadow_title });
            request.push({ key: "screen_two_title", value: screen_two_title });
            request.push({ key: "screen_two_shadow_title", value: screen_two_shadow_title });
            request.push({ key: "screen_two_inner_title", value: screen_two_inner_title });
            request.push({ key: "screen_two_description", value: screen_two_description });
            request.push({ key: "screen_two_image", value: screen_two_image });
            request.push({ key: "screen_two_image_alt_tag", value: screen_two_image_alt_tag });
            request.push({ key: "screen_three_title", value: screen_three_title });
            request.push({ key: "screen_three_shadow_title", value: screen_three_shadow_title });
            request.push({ key: "screen_four_title", value: screen_four_title });
            request.push({ key: "screen_four_shadow_title", value: screen_four_shadow_title });
            request.push({ key: "screen_four_image", value: screen_four_image });
            request.push({ key: "screen_four_image_alt_tag", value: screen_four_image_alt_tag });
            request.push({ key: "banner_screen_title", value: banner_screen_title });
            request.push({ key: "banner_screen_shadow_title", value: banner_screen_shadow_title });
            request.push({ key: "screen_faq_title", value: screen_faq_title });
            request.push({ key: "screen_faq_shadow_title", value: screen_faq_shadow_title });
            request.push({ key: "animation_content", value: animation_content });
            request.push({ key: "home_banner_video", value: home_banner_video });

            for (let i = 0; i < request.length; i++) {
                const data = request[i];
                const dataObj = { value: data.value };
                await HomePageContents.update(dataObj, { where: { field: data.key } });
            }

            cache.clear();
            request.push({ key: "welcome_banner_button_one_title", value: welcome_banner_button_one_title });
            request.push({ key: "welcome_banner_button_two_title", value: welcome_banner_button_two_title });
            request.push({ key: "welcome_banner_button_two_link", value: welcome_banner_button_two_link });
            request.push({ key: "screen_one_title", value: screen_one_title });
            request.push({ key: "screen_one_shadow_title", value: screen_one_shadow_title });
            request.push({ key: "screen_two_title", value: screen_two_title });
            request.push({ key: "screen_two_shadow_title", value: screen_two_shadow_title });
            request.push({ key: "screen_two_inner_title", value: screen_two_inner_title });
            request.push({ key: "screen_two_description", value: screen_two_description });
            request.push({ key: "screen_two_image", value: screen_two_image });
            request.push({ key: "screen_two_image_alt_tag", value: screen_two_image_alt_tag });
            request.push({ key: "screen_three_title", value: screen_three_title });
            request.push({ key: "screen_three_shadow_title", value: screen_three_shadow_title });
            request.push({ key: "screen_four_title", value: screen_four_title });
            request.push({ key: "screen_four_shadow_title", value: screen_four_shadow_title });
            request.push({ key: "screen_four_image", value: screen_four_image });
            request.push({ key: "screen_four_image_alt_tag", value: screen_four_image_alt_tag });
            request.push({ key: "banner_screen_title", value: banner_screen_title });
            request.push({ key: "banner_screen_shadow_title", value: banner_screen_shadow_title });
            request.push({ key: "screen_faq_title", value: screen_faq_title });
            request.push({ key: "screen_faq_shadow_title", value: screen_faq_shadow_title });
            request.push({ key: "animation_content", value: animation_content });
            request.push({ key: "home_banner_video", value: home_banner_video });

            for (let i = 0; i < request.length; i++) {
                const data = request[i];
                const dataObj = { value: data.value };
                await HomePageContents.update(dataObj, { where: { field: data.key } });
            }

            await req.flash("success", "Home Page Contents updated successfully.");
            res.redirect(siteUrl + "/home_page_contents");
        });
    },

    homeMassage: async function (req, res) {
        const data = await homePageContentsData();
        res.render("homeMassage", { metaTitle: siteName + " - Home Massage", title: "Home Massage", page: "home_massage", data: data });
    },

    homeMassagePost: async function (req, res) {
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
            { name: "home_massage_image_1", maxCount: 1 },
            { name: "home_massage_image_2", maxCount: 1 }
        ]);
        uploadMiddleware(req, res, async () => {
            const { home_massage_title, home_massage_intro, home_massage_right_paras, home_massage_image_1_old, home_massage_image_2_old, home_massage_image_1_alt_tag, home_massage_image_2_alt_tag } = req.body;
            const home_massage_image_1 = req.files && req.files.home_massage_image_1 ? req.files.home_massage_image_1[0].filename : home_massage_image_1_old;
            const home_massage_image_2 = req.files && req.files.home_massage_image_2 ? req.files.home_massage_image_2[0].filename : home_massage_image_2_old;

            let request = [];
            request.push({ key: "home_massage_title", value: home_massage_title });
            request.push({ key: "home_massage_intro", value: home_massage_intro });
            request.push({ key: "home_massage_right_paras", value: home_massage_right_paras });
            request.push({ key: "home_massage_image_1", value: home_massage_image_1 });
            request.push({ key: "home_massage_image_2", value: home_massage_image_2 });
            request.push({ key: "home_massage_image_1_alt_tag", value: home_massage_image_1_alt_tag });
            request.push({ key: "home_massage_image_2_alt_tag", value: home_massage_image_2_alt_tag });

            for (let i = 0; i < request.length; i++) {
                const data = request[i];
                const dataObj = { value: data.value };
                const [record, created] = await HomePageContents.findOrCreate({
                    where: { field: data.key },
                    defaults: dataObj
                });
                if (!created) {
                    await record.update(dataObj);
                }
            }

            cache.clear();
            await req.flash("success", "Home Massage updated successfully.");
            res.redirect(siteUrl + "/home_massage");
        });
    },

    whyChoose: async function (req, res) {
        const data = await homePageContentsData();
        if (data && data.why_choose_cards) {
            try {
                const cards = JSON.parse(data.why_choose_cards);
                if (Array.isArray(cards)) {
                    if (cards[0]) {
                        data.why_choose_card_one_title = cards[0].title;
                        data.why_choose_card_one_description = cards[0].description;
                        data.why_choose_card_one_icon = cards[0].icon;
                    }
                    if (cards[1]) {
                        data.why_choose_card_two_title = cards[1].title;
                        data.why_choose_card_two_description = cards[1].description;
                        data.why_choose_card_two_icon = cards[1].icon;
                    }
                    if (cards[2]) {
                        data.why_choose_card_three_title = cards[2].title;
                        data.why_choose_card_three_description = cards[2].description;
                        data.why_choose_card_three_icon = cards[2].icon;
                    }
                    if (cards[3]) {
                        data.why_choose_card_four_title = cards[3].title;
                        data.why_choose_card_four_description = cards[3].description;
                        data.why_choose_card_four_icon = cards[3].icon;
                    }
                }
            } catch (err) {
                console.error("Error parsing why_choose_cards: ", err);
            }
        }
        res.render("whyChoose", { metaTitle: siteName + " - Why Choose", title: "Why Choose", page: "why_choose", data: data });
    },

    whyChoosePost: async function (req, res) {
        const upload = multer().none();
        upload(req, res, async (err) => {
            if (err) {
                console.error("Error parsing form data: ", err);
                return res.status(500).send("Error parsing form data");
            }

            const {
                why_choose_title,
                why_choose_description,
                why_choose_card_one_title,
                why_choose_card_one_description,
                why_choose_card_one_icon,
                why_choose_card_two_title,
                why_choose_card_two_description,
                why_choose_card_two_icon,
                why_choose_card_three_title,
                why_choose_card_three_description,
                why_choose_card_three_icon,
                why_choose_card_four_title,
                why_choose_card_four_description,
                why_choose_card_four_icon,
                card_title,
                card_description,
                card_icon
            } = req.body;

            const titles = card_title || [];
            const descriptions = card_description || [];
            const icons = card_icon || [];

            const cardsArray = [
                {
                    title: why_choose_card_one_title || titles[0] || "",
                    description: why_choose_card_one_description || descriptions[0] || "",
                    icon: why_choose_card_one_icon || icons[0] || ""
                },
                {
                    title: why_choose_card_two_title || titles[1] || "",
                    description: why_choose_card_two_description || descriptions[1] || "",
                    icon: why_choose_card_two_icon || icons[1] || ""
                },
                {
                    title: why_choose_card_three_title || titles[2] || "",
                    description: why_choose_card_three_description || descriptions[2] || "",
                    icon: why_choose_card_three_icon || icons[2] || ""
                },
                {
                    title: why_choose_card_four_title || titles[3] || "",
                    description: why_choose_card_four_description || descriptions[3] || "",
                    icon: why_choose_card_four_icon || icons[3] || ""
                }
            ];

            let request = [];
            request.push({ key: "why_choose_title", value: why_choose_title });
            request.push({ key: "why_choose_description", value: why_choose_description });
            request.push({ key: "why_choose_cards", value: JSON.stringify(cardsArray) });

            for (let i = 0; i < request.length; i++) {
                const data = request[i];
                const dataObj = { value: data.value };
                const [record, created] = await HomePageContents.findOrCreate({
                    where: { field: data.key },
                    defaults: dataObj
                });
                if (!created) {
                    await record.update(dataObj);
                }
            }

            cache.clear();
            await req.flash("success", "Why Choose updated successfully.");
            res.redirect(siteUrl + "/why_choose");
        });
    },

    servicesOffered: async function (req, res) {
        const data = await homePageContentsData();
        res.render("servicesOffered", { metaTitle: siteName + " - Services Offered", title: "Services Offered", page: "services_offered", data: data });
    },

    servicesOfferedPost: async function (req, res) {
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
            { name: "services_offered_main_image", maxCount: 1 }
        ]);
        uploadMiddleware(req, res, async () => {
            const { services_offered_title, services_offered_intro, services_offered_main_image_old, services_offered_main_image_alt_tag, services_offered_qa1_title, services_offered_qa1_content, services_offered_qa2_title, services_offered_qa2_content } = req.body;
            const services_offered_main_image = req.files && req.files.services_offered_main_image ? req.files.services_offered_main_image[0].filename : services_offered_main_image_old;

            let request = [];
            request.push({ key: "services_offered_title", value: services_offered_title });
            request.push({ key: "services_offered_intro", value: services_offered_intro });
            request.push({ key: "services_offered_main_image", value: services_offered_main_image });
            request.push({ key: "services_offered_main_image_alt_tag", value: services_offered_main_image_alt_tag });
            request.push({ key: "services_offered_qa1_title", value: services_offered_qa1_title });
            request.push({ key: "services_offered_qa1_content", value: services_offered_qa1_content });
            request.push({ key: "services_offered_qa2_title", value: services_offered_qa2_title });
            request.push({ key: "services_offered_qa2_content", value: services_offered_qa2_content });

            for (let i = 0; i < request.length; i++) {
                const data = request[i];
                const dataObj = { value: data.value };
                const [record, created] = await HomePageContents.findOrCreate({
                    where: { field: data.key },
                    defaults: dataObj
                });
                if (!created) {
                    await record.update(dataObj);
                }
            }

            cache.clear();
            await req.flash("success", "Services Offered updated successfully.");
            res.redirect(siteUrl + "/services_offered");
        });
    },

    massageTypes: async function (req, res) {
        const data = await homePageContentsData();
        res.render("massageTypes", { metaTitle: siteName + " - Massage Types", title: "Massage Types", page: "massage_types", data: data });
    },

    massageTypesPost: async function (req, res) {
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
        const uploadMiddleware = initUpload.any();

        uploadMiddleware(req, res, async () => {
            const { massage_types_title, massage_types_description } = req.body;

            const cardIndices = [].concat(req.body.card_index || []);
            const cardTitles = [].concat(req.body.card_title || []);
            const cardDescriptions = [].concat(req.body.card_description || []);
            const cardOldImages = [].concat(req.body.card_image_old || []);

            let cardsArray = [];
            for (let i = 0; i < cardIndices.length; i++) {
                const idx = cardIndices[i];
                const fieldName = `card_image_${idx}`;
                const file = (req.files || []).find(f => f.fieldname === fieldName);
                const imageFilename = file ? file.filename : (cardOldImages[i] || "");

                cardsArray.push({
                    id: idx,
                    title: cardTitles[i] || "",
                    image: imageFilename,
                    description: cardDescriptions[i] || ""
                });
            }

            let request = [];
            request.push({ key: "massage_types_title", value: massage_types_title });
            request.push({ key: "massage_types_description", value: massage_types_description });
            request.push({ key: "massage_types_cards", value: JSON.stringify(cardsArray) });

            for (let i = 0; i < request.length; i++) {
                const data = request[i];
                const dataObj = { value: data.value };
                await HomePageContents.update(dataObj, { where: { field: data.key } });
            }

            cache.clear();
            await req.flash("success", "Massage Types updated successfully.");
            res.redirect(siteUrl + "/massage_types");
        });
    },

    healthBenefits: async function (req, res) {
        const data = await homePageContentsData();
        res.render("healthBenefits", { metaTitle: siteName + " - Health Benefits", title: "Health Benefits", page: "health_benefits", data: data });
    },

    healthBenefitsPost: async function (req, res) {
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
        const uploadMiddleware = initUpload.any();

        uploadMiddleware(req, res, async () => {
            const { health_benefits_title, health_benefits_description } = req.body;

            const cardIndices = [].concat(req.body.card_index || []);
            const cardNumbers = [].concat(req.body.card_number || []);
            const cardTitles = [].concat(req.body.card_title || []);
            const cardDescriptions = [].concat(req.body.card_description || []);
            const cardOldImages = [].concat(req.body.card_image_old || []);

            let cardsArray = [];
            for (let i = 0; i < cardIndices.length; i++) {
                const idx = cardIndices[i];
                const fieldName = `card_image_${idx}`;
                const file = (req.files || []).find(f => f.fieldname === fieldName);
                const imageFilename = file ? file.filename : (cardOldImages[i] || "");

                cardsArray.push({
                    id: idx,
                    number: cardNumbers[i] || "",
                    title: cardTitles[i] || "",
                    image: imageFilename,
                    description: cardDescriptions[i] || ""
                });
            }

            let request = [];
            request.push({ key: "health_benefits_title", value: health_benefits_title });
            request.push({ key: "health_benefits_description", value: health_benefits_description });
            request.push({ key: "health_benefits_cards", value: JSON.stringify(cardsArray) });

            for (let i = 0; i < request.length; i++) {
                const data = request[i];
                const dataObj = { value: data.value };
                await HomePageContents.update(dataObj, { where: { field: data.key } });
            }

            cache.clear();
            await req.flash("success", "Health Benefits updated successfully.");
            res.redirect(siteUrl + "/health_benefits");
        });
    },

    safetyPrivacy: async function (req, res) {
        const data = await homePageContentsData();
        res.render("safetyPrivacy", { metaTitle: siteName + " - Safety & Privacy", title: "Safety & Privacy", page: "safety_privacy", data: data });
    },

    safetyPrivacyPost: async function (req, res) {
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
        const uploadMiddleware = initUpload.any();

        uploadMiddleware(req, res, async () => {
            const { safety_privacy_title, safety_privacy_description } = req.body;

            const cardIndices = [].concat(req.body.card_index || []);
            const cardTitles = [].concat(req.body.card_title || []);
            const cardDescriptions = [].concat(req.body.card_description || []);
            const cardOldImages = [].concat(req.body.card_image_old || []);

            let cardsArray = [];
            for (let i = 0; i < cardIndices.length; i++) {
                const idx = cardIndices[i];
                const fieldName = `card_image_${idx}`;
                const file = (req.files || []).find(f => f.fieldname === fieldName);
                const imageFilename = file ? file.filename : (cardOldImages[i] || "");

                cardsArray.push({
                    id: idx,
                    title: cardTitles[i] || "",
                    image: imageFilename,
                    description: cardDescriptions[i] || ""
                });
            }

            let request = [];
            request.push({ key: "safety_privacy_title", value: safety_privacy_title });
            request.push({ key: "safety_privacy_description", value: safety_privacy_description });
            request.push({ key: "safety_privacy_cards", value: JSON.stringify(cardsArray) });

            for (let i = 0; i < request.length; i++) {
                const data = request[i];
                const dataObj = { value: data.value };
                await HomePageContents.update(dataObj, { where: { field: data.key } });
            }

            cache.clear();
            await req.flash("success", "Safety & Privacy updated successfully.");
            res.redirect(siteUrl + "/safety_privacy");
        });
    },

    bookingSteps: async function (req, res) {
        const data = await homePageContentsData();
        res.render("bookingSteps", { metaTitle: siteName + " - How to Book", title: "How to Book", page: "booking_steps", data: data });
    },

    bookingStepsPost: async function (req, res) {
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
        const uploadMiddleware = initUpload.any();

        uploadMiddleware(req, res, async () => {
            const { booking_steps_title, booking_steps_description } = req.body;

            const cardIndices = [].concat(req.body.card_index || req.body['card_index[]'] || []);
            const cardNumbers = [].concat(req.body.card_number || req.body['card_number[]'] || []);
            const cardTitles = [].concat(req.body.card_title || req.body['card_title[]'] || []);
            const cardDescriptions = [].concat(req.body.card_description || req.body['card_description[]'] || []);
            const cardOldImages = [].concat(req.body.card_image_old || req.body['card_image_old[]'] || []);

            let cardsArray = [];
            for (let i = 0; i < cardIndices.length; i++) {
                const idx = cardIndices[i];
                const fieldName = `card_image_${idx}`;
                const file = (req.files || []).find(f => f.fieldname === fieldName);
                const imageFilename = file ? file.filename : (cardOldImages[i] || "");

                cardsArray.push({
                    id: idx,
                    number: cardNumbers[i] || "",
                    title: cardTitles[i] || "",
                    image: imageFilename,
                    description: cardDescriptions[i] || ""
                });
            }

            let request = [];
            request.push({ key: "booking_steps_title", value: booking_steps_title });
            request.push({ key: "booking_steps_description", value: booking_steps_description });
            request.push({ key: "booking_steps_cards", value: JSON.stringify(cardsArray) });

            for (let i = 0; i < request.length; i++) {
                const data = request[i];
                const dataObj = { value: data.value };
                await HomePageContents.update(dataObj, { where: { field: data.key } });
            }

            cache.clear();
            await req.flash("success", "How to Book updated successfully.");
            res.redirect(siteUrl + "/booking_steps");
        });
    },

    massageCost: async function (req, res) {
        const data = await homePageContentsData();
        res.render("massageCost", { metaTitle: siteName + " - Massage Cost", title: "Massage Cost", page: "massage_cost", data: data });
    },

    massageCostPost: async function (req, res) {
        const { massage_cost_title, massage_cost_description, massage_cost_box_title, massage_cost_box_bullets } = req.body;

        let request = [];
        request.push({ key: "massage_cost_title", value: massage_cost_title });
        request.push({ key: "massage_cost_description", value: massage_cost_description });
        request.push({ key: "massage_cost_box_title", value: massage_cost_box_title });
        request.push({ key: "massage_cost_box_bullets", value: massage_cost_box_bullets });

        for (let i = 0; i < request.length; i++) {
            const data = request[i];
            const dataObj = { value: data.value };
            await HomePageContents.update(dataObj, { where: { field: data.key } });
        }

        cache.clear();
        await req.flash("success", "Massage Cost updated successfully.");
        res.redirect(siteUrl + "/massage_cost");
    },

    areasCovered: async function (req, res) {
        const data = await homePageContentsData();
        res.render("areasCovered", { metaTitle: siteName + " - Areas Covered", title: "Areas Covered", page: "areas_covered", data: data });
    },

    areasCoveredPost: async function (req, res) {
        const { areas_covered_title, areas_covered_description } = req.body;

        const cardIndices = [].concat(req.body.card_index || req.body['card_index[]'] || []);
        const cardTitles = [].concat(req.body.card_title || req.body['card_title[]'] || []);
        const cardDescriptions = [].concat(req.body.card_description || req.body['card_description[]'] || []);

        let cardsArray = [];
        for (let i = 0; i < cardIndices.length; i++) {
            cardsArray.push({
                id: cardIndices[i],
                title: cardTitles[i] || "",
                description: cardDescriptions[i] || ""
            });
        }

        let request = [];
        request.push({ key: "areas_covered_title", value: areas_covered_title });
        request.push({ key: "areas_covered_description", value: areas_covered_description });
        request.push({ key: "areas_covered_cards", value: JSON.stringify(cardsArray) });

        for (let i = 0; i < request.length; i++) {
            const data = request[i];
            const dataObj = { value: data.value };
            await HomePageContents.update(dataObj, { where: { field: data.key } });
        }

        cache.clear();
        await req.flash("success", "Areas Covered updated successfully.");
        res.redirect(siteUrl + "/areas_covered");
    },

    massageLegal: async function (req, res) {
        const data = await homePageContentsData();
        res.render("massageLegal", { metaTitle: siteName + " - Massage Legal", title: "Massage Legal", page: "massage_legal", data: data });
    },

    massageLegalPost: async function (req, res) {
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
        const uploadMiddleware = initUpload.any();

        uploadMiddleware(req, res, async () => {
            const { massage_legal_title, massage_legal_description, massage_legal_image_old } = req.body;

            const file = (req.files || []).find(f => f.fieldname === 'massage_legal_image');
            const imageFilename = file ? file.filename : massage_legal_image_old || "";

            const itemIndices = [].concat(req.body.item_index || []);
            const itemTitles = [].concat(req.body.item_title || []);
            const itemDescriptions = [].concat(req.body.item_description || []);

            let itemsArray = [];
            for (let i = 0; i < itemIndices.length; i++) {
                itemsArray.push({
                    id: itemIndices[i],
                    title: itemTitles[i] || "",
                    description: itemDescriptions[i] || ""
                });
            }

            let request = [];
            request.push({ key: "massage_legal_title", value: massage_legal_title });
            request.push({ key: "massage_legal_description", value: massage_legal_description });
            request.push({ key: "massage_legal_items", value: JSON.stringify(itemsArray) });
            request.push({ key: "massage_legal_image", value: imageFilename });

            for (let i = 0; i < request.length; i++) {
                const data = request[i];
                const dataObj = { value: data.value };
                await HomePageContents.update(dataObj, { where: { field: data.key } });
            }

            cache.clear();
            await req.flash("success", "Massage Legal updated successfully.");
            res.redirect(siteUrl + "/massage_legal");
        });
    },

    getStarted: async function (req, res) {
        const data = await homePageContentsData();
        res.render("getStarted", { metaTitle: siteName + " - Get Started", title: "Get Started", page: "get_started", data: data });
    },

    getStartedPost: async function (req, res) {
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
        const uploadMiddleware = initUpload.any();

        uploadMiddleware(req, res, async () => {
            const { get_started_title, get_started_description, get_started_image_old } = req.body;

            const file = (req.files || []).find(f => f.fieldname === 'get_started_image');
            const imageFilename = file ? file.filename : get_started_image_old || "";

            let request = [];
            request.push({ key: "get_started_title", value: get_started_title });
            request.push({ key: "get_started_description", value: get_started_description });
            request.push({ key: "get_started_image", value: imageFilename });

            for (let i = 0; i < request.length; i++) {
                const data = request[i];
                const dataObj = { value: data.value };
                await HomePageContents.update(dataObj, { where: { field: data.key } });
            }

            cache.clear();
            await req.flash("success", "Get Started updated successfully.");
            res.redirect(siteUrl + "/get_started");
        });
    },

};
