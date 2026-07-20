const { body, validationResult } = require('express-validator');
var multer = require("multer");
const models = require("../models");
const { get } = require('memory-cache');
const TimeSlot = models.timeSlot;
const TimeSlotValue = models.timeSlotValues;

const title 	= "Time slot";
const page  	= "time_slot";
const pageUrl   = "time_slot";
const metaTitle = siteName + " | Time Slot";

const list = async (req, res) => {
    try {
        var action = req.query.action;
        const rows = await TimeSlot.findAll({ order: [['id', 'ASC']] });
        res.render("timeSlot", {
            title: title,
            page: page,
            pageUrl: pageUrl,
            action : action,
            metaTitle: metaTitle,
            rows: rows,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};
  
const add = async (req, res) => {
    var action = req.query.action;
    res.render("timeSlot", {
        title: `Add ${title}`,
        page: page,
        pageUrl: pageUrl,
        action: action,
        row  : [],
        metaTitle: metaTitle,
    });
};


const view = async (req, res) => {
    try {
        var action = req.query.action;
        var getId  = req.query.id;
        const timeSlot = await TimeSlot.findOne({where: { id: getId}});
        const timeSlotValues = await TimeSlotValue.findAll({
            where: { time_slot_id: getId},
            order: [['date', 'ASC'], ['start_time', 'ASC']],

        });

        const groupedTimeSlots = timeSlotValues.reduce((acc, slot)=>{
            const date = slot.date;
            console.log("slot", slot);
            console.log("date", date);
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(slot);
            return acc;
        },{});
        res.render("timeSlot", {
            title: `View ${title}`,
            page: page,
            pageUrl: pageUrl,
            action : action,
            metaTitle: metaTitle,
            timeSlot: timeSlot,
            groupedTimeSlots: groupedTimeSlots,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

  
const edit = async (req, res) => {
    try {
        var action = req.query.action;
        var getId  = req.query.id;
        const row = await TimeSlot.findOne({ where: { id: getId } });
        if (!row) {
            req.flash("error", "Time slot not found.");
            return res.redirect(`/${pageUrl}`);
        }
        res.render("timeSlot", {
            title: `Edit ${title}`,
            page: page,
            pageUrl: pageUrl,
            action : action,
            metaTitle: metaTitle,
            row: row,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};


const destroy = async (req, res) => {
    try {
        var getId  = req.query.id;
        await TimeSlot.destroy({ where: { id: getId } });
        req.flash("success", "Time slot deleted successfully.");
        res.redirect(`/${pageUrl}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
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

    store : async (req, res) => {
        try {
            const { id, start_date, end_date, title, status, ...slotsData } = req.body;
            const timeSlots = [];
    
           
            for (const date in slotsData) {
                if (date.startsWith('slots')) {
                  
                    const match = date.match(/\[(.*?)\]/);
                    if (match) {
                        const slotDate = match[1]; 
    
                        
                        if (date.includes('[from][]')) {
                            const fromTimes = slotsData[date]; 
                            const toTimes = slotsData[date.replace('[from][]', '[to][]')]; 
    
                          
                            const slots = fromTimes.map((from, index) => ({
                                from: from,
                                to: toTimes[index],
                            }));
    
                           
                            timeSlots.push({
                                date: slotDate,
                                slots: slots,
                            });
                        }
                    }
                }
            }

            const timeSlotRecord = await TimeSlot.create({
                title: title,
                start_date : start_date,
                end_date : end_date,
                status: status,    
            })
    
            for (const slot of timeSlots) {
                const { date, slots } = slot;
    
                for (const timeSlot of slots) {
                    const { from, to } = timeSlot;

                    await TimeSlotValue.create({
                        time_slot_id: timeSlotRecord.id, 
                        date: date,
                        start_time: from,
                        end_time: to,
                    });
            
                }
            }
            
            req.flash("success", "Time slots saved successfully.");
            res.redirect(`/${pageUrl}`);
        } catch (error) {
            console.error(error);
            req.flash("error", "An error occurred while saving the time slot.");
            res.redirect("back");
        }
    }
};
