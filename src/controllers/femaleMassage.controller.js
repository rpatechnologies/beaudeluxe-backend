const db = require("../models");
const HomePageContents = db.homePageContents;
const { homePageContentsData } = require("../utils/global.helper");
const cache = require("memory-cache");
const multer = require("multer");
const fs = require("fs");

const title = "Female Massage Cost";
const page = "female_massage_therapist";
const pageUrl = "female_massage_therapist";
const metaTitle = siteName + " | Female Massage Cost Settings";

const saveField = async (field, value) => {
    const existing = await HomePageContents.findOne({ where: { field: field } });
    if (existing) {
        await HomePageContents.update({ value: value }, { where: { field: field } });
    } else {
        await HomePageContents.create({ field: field, value: value });
    }
};

module.exports = {
    index: async function (req, res) {
        try {
            const data = await homePageContentsData();
            res.render("femaleMassage", {
                metaTitle: metaTitle,
                title: title,
                page: page,
                pageUrl: pageUrl,
                data: data
            });
        } catch (error) {
            console.error(`Error occurred in femaleMassage.controller.js index:`, error);
            return res.status(500).send("Something went wrong");
        }
    },

    store: async function (req, res) {
        try {
            const { 
                women_massage_cost_title, 
                women_massage_cost_description, 
                women_areas_covered_title, 
                women_areas_covered_description 
            } = req.body;

            // Process Cost Rows
            const costService = [].concat(req.body.cost_service || req.body['cost_service[]'] || []);
            const costPrice60 = [].concat(req.body.cost_price_60 || req.body['cost_price_60[]'] || []);
            const costPrice90 = [].concat(req.body.cost_price_90 || req.body['cost_price_90[]'] || []);

            let costRowsArray = [];
            for (let i = 0; i < costService.length; i++) {
                if (costService[i] && costService[i].trim() !== "") {
                    costRowsArray.push({
                        service: costService[i],
                        price_60: costPrice60[i] || "",
                        price_90: costPrice90[i] || ""
                    });
                }
            }

            // Process Areas Covered Cards
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

            await saveField("women_massage_cost_title", women_massage_cost_title || "");
            await saveField("women_massage_cost_description", women_massage_cost_description || "");
            await saveField("women_massage_cost_rows", JSON.stringify(costRowsArray));
            await saveField("women_areas_covered_title", women_areas_covered_title || "");
            await saveField("women_areas_covered_description", women_areas_covered_description || "");
            await saveField("women_areas_covered_cards", JSON.stringify(cardsArray));

            cache.clear();
            await req.flash("success", "Female Massage Cost Settings updated successfully.");
            res.redirect(siteUrl + "/female_massage_therapist");
        } catch (error) {
            console.error(`Error occurred in femaleMassage.controller.js store:`, error);
            await req.flash("error", "Something went wrong, please try again.");
            res.redirect(siteUrl + "/female_massage_therapist");
        }
    },

    typeOfWomenMassageIndex: async function (req, res) {
        try {
            const data = await homePageContentsData();
            res.render("typeOfWomenMassage", {
                metaTitle: siteName + " | Type of Women Massage Settings",
                title: "Type of Women Massage",
                page: "type_of_women_massage",
                pageUrl: "type_of_women_massage",
                data: data
            });
        } catch (error) {
            console.error(`Error occurred in femaleMassage.controller.js typeOfWomenMassageIndex:`, error);
            return res.status(500).send("Something went wrong");
        }
    },

    typeOfWomenMassageStore: async function (req, res) {
        try {
            var dirForUpload = "./public/uploads/homepagecontents/";
            if (!fs.existsSync(dirForUpload)) {
                fs.mkdirSync(dirForUpload, { recursive: true });
            }

            var storage = multer.diskStorage({
                destination: function (req, file, callback) {
                    callback(null, "./public/uploads/homepagecontents/");
                },
                filename: function (req, file, callback) {
                    callback(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
                },
            });

            const initUpload = multer({ storage: storage });
            const uploadMiddleware = initUpload.any();

const { processAndConvertImageToWebp } = require("../utils/image.helper");

            uploadMiddleware(req, res, async () => {
                if (req.files && req.files.length > 0) {
                    for (let f of req.files) {
                        if (/\.(png|jpg|jpeg|avif|webp)$/i.test(f.originalname || f.filename)) {
                            f.filename = await processAndConvertImageToWebp(f, "./public/uploads/homepagecontents/");
                        }
                    }
                }
                const { women_massage_types_title, women_massage_types_description } = req.body;

                const cardIndices = [].concat(req.body.card_index || req.body['card_index[]'] || []);
                const cardTitles = [].concat(req.body.card_title || req.body['card_title[]'] || []);
                const cardAltTags = [].concat(req.body.card_alt_tag || req.body['card_alt_tag[]'] || []);
                const cardDescriptions = [].concat(req.body.card_description || req.body['card_description[]'] || []);
                const cardSlugs = [].concat(req.body.card_slug || req.body['card_slug[]'] || []);
                const cardOldImages = [].concat(req.body.card_old_image || req.body['card_old_image[]'] || []);

                let cardsArray = [];
                for (let i = 0; i < cardTitles.length; i++) {
                    if (!cardTitles[i] || cardTitles[i].trim() === "") continue;

                    let imageName = cardOldImages[i] || "";
                    if (req.files && req.files.length > 0) {
                        const fileMatch = req.files.find(f => f.fieldname === `card_image_${i}` || f.fieldname === `card_image[${i}]` || f.fieldname === `card_image_${cardIndices[i]}`);
                        if (fileMatch) {
                            imageName = fileMatch.filename;
                        }
                    }

                    cardsArray.push({
                        id: cardIndices[i] || (i + 1),
                        title: cardTitles[i] || "",
                        image: imageName,
                        altTag: cardAltTags[i] || cardTitles[i] || "",
                        description: cardDescriptions[i] || "",
                        slug: cardSlugs[i] || ""
                    });
                }

                await saveField("women_massage_types_title", women_massage_types_title || "");
                await saveField("women_massage_types_description", women_massage_types_description || "");
                await saveField("women_massage_types_cards", JSON.stringify(cardsArray));

                cache.clear();
                await req.flash("success", "Type of Women Massage updated successfully.");
                res.redirect(siteUrl + "/type_of_women_massage");
            });
        } catch (error) {
            console.error(`Error occurred in typeOfWomenMassageStore:`, error);
            await req.flash("error", "Something went wrong, please try again.");
            res.redirect(siteUrl + "/type_of_women_massage");
        }
    }
};
