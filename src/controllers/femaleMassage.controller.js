const db = require("../models");
const HomePageContents = db.homePageContents;
const { homePageContentsData } = require("../utils/global.helper");
const cache = require("memory-cache");

const title = "Female Massage Therapist";
const page = "female_massage_therapist";
const pageUrl = "female_massage_therapist";
const metaTitle = siteName + " | Female Massage Settings";

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

            let request = [];
            request.push({ key: "women_massage_cost_title", value: women_massage_cost_title || "" });
            request.push({ key: "women_massage_cost_description", value: women_massage_cost_description || "" });
            request.push({ key: "women_massage_cost_rows", value: JSON.stringify(costRowsArray) });
            request.push({ key: "women_areas_covered_title", value: women_areas_covered_title || "" });
            request.push({ key: "women_areas_covered_description", value: women_areas_covered_description || "" });
            request.push({ key: "women_areas_covered_cards", value: JSON.stringify(cardsArray) });

            for (let i = 0; i < request.length; i++) {
                const data = request[i];
                const dataObj = { value: data.value };
                await HomePageContents.update(dataObj, { where: { field: data.key } });
            }

            cache.clear();
            await req.flash("success", "Female Massage Settings updated successfully.");
            res.redirect(siteUrl + "/female_massage_therapist");
        } catch (error) {
            console.error(`Error occurred in femaleMassage.controller.js store:`, error);
            await req.flash("error", "Something went wrong, please try again.");
            res.redirect(siteUrl + "/female_massage_therapist");
        }
    }
};
