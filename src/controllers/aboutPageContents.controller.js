const fs = require('fs');
var multer = require("multer");
const db = require("../models");
const HomePageContents = db.homePageContents;
const { homePageContentsData } = require("../utils/global.helper");
const cache = require("memory-cache");
const { processAndConvertImageToWebp } = require("../utils/image.helper");

const convertReqFilesToWebp = async (reqFiles, uploadDir) => {
    if (!reqFiles) return;
    if (Array.isArray(reqFiles)) {
        for (let f of reqFiles) {
            if (/\.(png|jpg|jpeg|avif|webp)$/i.test(f.originalname || f.filename)) {
                f.filename = await processAndConvertImageToWebp(f, uploadDir);
            }
        }
    } else if (typeof reqFiles === 'object') {
        for (let key of Object.keys(reqFiles)) {
            for (let f of reqFiles[key]) {
                if (/\.(png|jpg|jpeg|avif|webp)$/i.test(f.originalname || f.filename)) {
                    f.filename = await processAndConvertImageToWebp(f, uploadDir);
                }
            }
        }
    }
};

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

module.exports = {

    aboutStory: async function (req, res) {
        const data = await homePageContentsData();
        res.render("aboutStory", { metaTitle: siteName + " - Our Story", title: "Our Story", page: "about_story", data: data });
    },

    aboutStoryPost: async function (req, res) {
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
            { name: "about_story_image_1", maxCount: 1 },
            { name: "about_story_image_2", maxCount: 1 },
            { name: "about_story_image_3", maxCount: 1 }
        ]);
        uploadMiddleware(req, res, async () => {
            await convertReqFilesToWebp(req.files, "./public/uploads/homepagecontents/");
            const { about_story_main_title, about_story_how_content, about_story_image_1_old, about_story_image_2_old, about_story_image_3_old } = req.body;
            const about_story_image_1 = req.files && req.files.about_story_image_1 ? req.files.about_story_image_1[0].filename : about_story_image_1_old;
            const about_story_image_2 = req.files && req.files.about_story_image_2 ? req.files.about_story_image_2[0].filename : about_story_image_2_old;
            const about_story_image_3 = req.files && req.files.about_story_image_3 ? req.files.about_story_image_3[0].filename : about_story_image_3_old;

            let request = [];
            request.push({ key: "about_story_main_title", value: about_story_main_title });
            request.push({ key: "about_story_how_content", value: about_story_how_content });
            request.push({ key: "about_story_image_1", value: about_story_image_1 });
            request.push({ key: "about_story_image_2", value: about_story_image_2 });
            request.push({ key: "about_story_image_3", value: about_story_image_3 });

            await updateFields(request);
            cache.clear();
            await req.flash("success", "Our Story updated successfully.");
            res.redirect(siteUrl + "/about_story");
        });
    },

    aboutMission: async function (req, res) {
        const data = await homePageContentsData();
        res.render("aboutMission", { metaTitle: siteName + " - Our Mission", title: "Our Mission", page: "about_mission", data: data });
    },

    aboutMissionPost: async function (req, res) {
        const { about_mission_title, about_mission_content } = req.body;

        let request = [];
        request.push({ key: "about_mission_title", value: about_mission_title });
        request.push({ key: "about_mission_content", value: about_mission_content });

        await updateFields(request);
        cache.clear();
        await req.flash("success", "Our Mission updated successfully.");
        res.redirect(siteUrl + "/about_mission");
    },

    aboutNumbers: async function (req, res) {
        const data = await homePageContentsData();
        res.render("aboutNumbers", { metaTitle: siteName + " - By The Numbers", title: "By The Numbers", page: "about_numbers", data: data });
    },

    aboutNumbersPost: async function (req, res) {
        const {
            about_numbers_title,
            about_numbers_stat1_num, about_numbers_stat1_label,
            about_numbers_stat2_num, about_numbers_stat2_label,
            about_numbers_stat3_num, about_numbers_stat3_label,
            about_numbers_stat4_num, about_numbers_stat4_label,
            about_numbers_stat5_num, about_numbers_stat5_label
        } = req.body;

        let request = [];
        request.push({ key: "about_numbers_title", value: about_numbers_title });
        request.push({ key: "about_numbers_stat1_num", value: about_numbers_stat1_num });
        request.push({ key: "about_numbers_stat1_label", value: about_numbers_stat1_label });
        request.push({ key: "about_numbers_stat2_num", value: about_numbers_stat2_num });
        request.push({ key: "about_numbers_stat2_label", value: about_numbers_stat2_label });
        request.push({ key: "about_numbers_stat3_num", value: about_numbers_stat3_num });
        request.push({ key: "about_numbers_stat3_label", value: about_numbers_stat3_label });
        request.push({ key: "about_numbers_stat4_num", value: about_numbers_stat4_num });
        request.push({ key: "about_numbers_stat4_label", value: about_numbers_stat4_label });
        request.push({ key: "about_numbers_stat5_num", value: about_numbers_stat5_num });
        request.push({ key: "about_numbers_stat5_label", value: about_numbers_stat5_label });

        await updateFields(request);
        cache.clear();
        await req.flash("success", "By The Numbers updated successfully.");
        res.redirect(siteUrl + "/about_numbers");
    },

    aboutTeam: async function (req, res) {
        const data = await homePageContentsData();
        res.render("aboutTeam", { metaTitle: siteName + " - Meet Our Team", title: "Meet Our Team", page: "about_team", data: data });
    },

    aboutTeamPost: async function (req, res) {
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
            await convertReqFilesToWebp(req.files, "./public/uploads/homepagecontents/");
            const { about_team_title, about_team_description } = req.body;

            const cardIndices = [].concat(req.body.card_index || []);
            const memberNames = [].concat(req.body.member_name || []);
            const memberRoles = [].concat(req.body.member_role || []);
            const cardOldImages = [].concat(req.body.card_image_old || []);

            let membersArray = [];
            for (let i = 0; i < cardIndices.length; i++) {
                const idx = cardIndices[i];
                const fieldName = `card_image_${idx}`;
                const file = (req.files || []).find(f => f.fieldname === fieldName);
                const imageFilename = file ? file.filename : (cardOldImages[i] || "");

                membersArray.push({
                    id: idx,
                    name: memberNames[i] || "",
                    role: memberRoles[i] || "",
                    image: imageFilename
                });
            }

            let request = [];
            request.push({ key: "about_team_title", value: about_team_title });
            request.push({ key: "about_team_description", value: about_team_description });
            request.push({ key: "about_team_members", value: JSON.stringify(membersArray) });

            await updateFields(request);
            cache.clear();
            await req.flash("success", "Meet Our Team updated successfully.");
            res.redirect(siteUrl + "/about_team");
        });
    },

    aboutContact: async function (req, res) {
        const data = await homePageContentsData();
        res.render("aboutContact", { metaTitle: siteName + " - About Contact", title: "About Contact", page: "about_contact", data: data });
    },

    aboutContactPost: async function (req, res) {
        const { about_contact_title, about_contact_description } = req.body;

        const cardIndices = [].concat(req.body.card_index || []);
        const cardTitles = [].concat(req.body.card_title || []);
        const cardDescs = [].concat(req.body.card_desc || []);

        let cardsArray = [];
        for (let i = 0; i < cardIndices.length; i++) {
            cardsArray.push({
                id: cardIndices[i],
                title: cardTitles[i] || "",
                description: cardDescs[i] || ""
            });
        }

        let request = [];
        request.push({ key: "about_contact_title", value: about_contact_title });
        request.push({ key: "about_contact_description", value: about_contact_description });
        request.push({ key: "about_contact_cards", value: JSON.stringify(cardsArray) });

        await updateFields(request);
        cache.clear();
        await req.flash("success", "About Contact updated successfully.");
        res.redirect(siteUrl + "/about_contact");
    },

};
