const { body, validationResult } = require('express-validator');
const fs = require('fs');
var multer = require("multer");
const db = require("../models");
const HomePageContents = db.homePageContents;
const { homePageContentsData } = require("../utils/global.helper");

module.exports = {

    homePageContents: async function (req, res) {
        const data = await homePageContentsData();
        res.render("homePageContents", {metaTitle: siteName + " - Home Page Contents", title: "Home Page Contents", page: "home_page_contents", data: data});
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
            const { welcome_banner_button_one_title, welcome_banner_button_two_title, welcome_banner_button_two_link, screen_one_title, screen_one_shadow_title, screen_two_title, screen_two_shadow_title, screen_two_inner_title, screen_two_description, screen_two_image_old, screen_two_image_alt_tag, screen_three_title, screen_three_shadow_title, screen_four_title, screen_four_shadow_title, screen_four_image_old, screen_four_image_alt_tag, banner_screen_title, banner_screen_shadow_title, screen_faq_title, screen_faq_shadow_title, animation_content ,home_banner_video_old} = req.body;
            const screen_two_image = req.files && req.files.screen_two_image ? req.files.screen_two_image[0].filename : screen_two_image_old;
            const home_banner_video = req.files && req.files.home_banner_video ? req.files.home_banner_video[0].filename : home_banner_video_old;
            const screen_four_image = req.files && req.files.screen_four_image ? req.files.screen_four_image[0].filename : screen_four_image_old;

            let request = [];
            request.push({key: "welcome_banner_button_one_title", value: welcome_banner_button_one_title});
            request.push({key: "welcome_banner_button_two_title", value: welcome_banner_button_two_title});
            request.push({key: "welcome_banner_button_two_link", value: welcome_banner_button_two_link});
            request.push({key: "screen_one_title", value: screen_one_title});
            request.push({key: "screen_one_shadow_title", value: screen_one_shadow_title});
            request.push({key: "screen_two_title", value: screen_two_title});
            request.push({key: "screen_two_shadow_title", value: screen_two_shadow_title});
            request.push({key: "screen_two_inner_title", value: screen_two_inner_title});
            request.push({key: "screen_two_description", value: screen_two_description});
            request.push({key: "screen_two_image", value: screen_two_image});
            request.push({key: "screen_two_image_alt_tag", value: screen_two_image_alt_tag});
            request.push({key: "screen_three_title", value: screen_three_title});
            request.push({key: "screen_three_shadow_title", value: screen_three_shadow_title});
            request.push({key: "screen_four_title", value: screen_four_title});
            request.push({key: "screen_four_shadow_title", value: screen_four_shadow_title});
            request.push({key: "screen_four_image", value: screen_four_image});
            request.push({key: "screen_four_image_alt_tag", value: screen_four_image_alt_tag});
            request.push({key: "banner_screen_title", value: banner_screen_title});
            request.push({key: "banner_screen_shadow_title", value: banner_screen_shadow_title});
            request.push({key: "screen_faq_title", value: screen_faq_title});
            request.push({key: "screen_faq_shadow_title", value: screen_faq_shadow_title});
            request.push({key: "animation_content", value: animation_content});
            request.push({key: "home_banner_video", value: home_banner_video});

            for(let i = 0; i < request.length; i++)
            {
                const data = request[i];
                const dataObj = { value: data.value };
                await HomePageContents.update(dataObj, {where: {field: data.key}});
            }

            await req.flash("success", "Home Page Contents updated successfully.");
            res.redirect(siteUrl + "/home_page_contents");
        });
    },

};
