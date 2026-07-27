const { body, validationResult } = require("express-validator");
const models = require("../models");
const Service = models.service;
const SubService = models.subServices;
const SubServicePrice = models.subServicePrice;
const Category = models.category;
const title = "Sub Service";
const page = "sub_service";
const pageUrl = "sub_service";
const metaTitle = siteName + " | Sub Service";

const list = async (req, res) => {
  try {
    let action = req.query.action;
    let rows = await SubService.findAll({
      where: {},
      order: [["id", "DESC"]],
      include: [Service],
    });
    res.render("subService", {
      title: title + "s",
      page: page,
      pageUrl: pageUrl,
      metaTitle: metaTitle,
      action: action,
      rows: rows,
    });
  } catch (error) {
    console.error(`Error occurred on route ${req.originalUrl}:`, error);
    return res
      .status(500)
      .json({
        status: false,
        message: "Something went wrong, please try again",
      });
  }
};

const add = async (req, res) => {
  try {
    let action = req.query.action;
    let service = await Service.findAll({ where: {}, order: [["id", "DESC"]] });
    let categories = await Category.findAll({ where: {} });
    res.render("subService", {
      title: "Add " + title,
      page: page,
      pageUrl: pageUrl,
      metaTitle: metaTitle,
      action: action,
      row: [],
      subServicePrice: [],
      service: service || [],
      categories: categories,
      details: [],
    });
  } catch (error) {
    console.error(`Error occurred on route ${req.originalUrl}:`, error);
    return res
      .status(500)
      .json({
        status: false,
        message: "Something went wrong, please try again",
      });
  }
};

const view = async (req, res) => {
  try {
    let action = req.query.action;
    let getId = req.query.id;
    const row = await SubService.findOne({
      where: { id: getId },
      include: [Service],
    });
    const subServicePrice = await SubServicePrice.findAll({
      where: { subservice_id: getId },
    });
    res.render("subService", {
      title: "View " + title,
      page: page,
      pageUrl: pageUrl,
      metaTitle: metaTitle,
      action: action,
      subservice_price: subServicePrice,
      row: row,
      details: [],
    });
  } catch (error) {
    console.error(`Error occurred on route ${req.originalUrl}:`, error);
    return res
      .status(500)
      .json({
        status: false,
        message: "Something went wrong, please try again",
      });
  }
};

const edit = async (req, res) => {
  try {
    let action = req.query.action;
    let getId = req.query.id;
    let service = await Service.findAll({
      where: { status: 1 },
      order: [["id", "DESC"]],
    });
    const subServicePrice = await SubServicePrice.findAll({
      where: { subservice_id: getId },
    });
    const row = await SubService.findOne({
      where: { id: getId },
      include: [Service],
    });

    res.render("subService", {
      title: "Edit " + title,
      page: page,
      pageUrl: pageUrl,
      metaTitle: metaTitle,
      action: action,
      row: row,
      service: service || [],
      subServicePrice: subServicePrice,
      details: [],
    });
  } catch (error) {
    console.error(`Error occurred on route ${req.originalUrl}:`, error);
    return res
      .status(500)
      .json({
        status: false,
        message: "Something went wrong, please try again",
      });
  }
};

const destroy = async (req, res) => {
  try {
    let getId = req.query.id;

    await SubServicePrice.destroy({ where: { subservice_id: getId } });
    await SubService.destroy({ where: { id: getId } });

    await req.flash("success", "Sub Service deleted successfully.");
    res.redirect(siteUrl + "/" + pageUrl);
  } catch (error) {
    console.error(`Error occurred on route ${req.originalUrl}:`, error);
    await req.flash("error", "Something went wrong, please try again.");
    res.redirect(siteUrl + "/" + pageUrl);

  }
};

module.exports = {
  index: async function (req, res) {
    let action = req.query.action;
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
    const {
      id,
      service_id,
      title,
      category,
      gender,
      description,
      duration,
      price_men,
      price_women,
      category_id,
      status,
    } = req.body;

    const formData = {
      title: title,
      service_id: service_id,
      description: description,
      type: category,
      gender: gender || "Both",
      status: status,
    };
    let lastId = id;

    if (id && id != "") {
      await SubService.update(formData, { where: { id: id } });
      await req.flash("success", "SubService updated successfully.");
    } else {
      const result = await SubService.create(formData);
      lastId = result ? result.id : null;
      await req.flash("success", "SubService created successfully.");
    }

    // Fetch all referenced subservice_price_id from form_services to prevent breaking foreign keys
    const referencedPrices = await models.formServices.findAll({
      attributes: ['subservice_id', 'subservice_price_id'],
      raw: true
    });
    const referencedIds = new Set(referencedPrices.map(r => r.subservice_price_id).filter(id => id !== null));

    const existingPrices = await SubServicePrice.findAll({
      where: { subservice_id: lastId }
    });

    const pricesToSet = [];
    if (Array.isArray(duration)) {
      if (duration && duration.length > 0) {
        for (let i = 0; i < duration.length; i++) {
          const pMen = price_men && price_men[i] ? price_men[i].trim() : "";
          const pWomen = price_women && price_women[i] ? price_women[i].trim() : "";

          if (pMen !== "") {
            pricesToSet.push({ category_id: category_id[i], title: duration[i], price: pMen, gender: "Men" });
          }
          if (pWomen !== "") {
            pricesToSet.push({ category_id: category_id[i], title: duration[i], price: pWomen, gender: "Women" });
          }
        }
      }
    } else {
      const pMen = price_men ? price_men.trim() : "";
      const pWomen = price_women ? price_women.trim() : "";

      if (pMen !== "") {
        pricesToSet.push({ category_id: null, title: duration, price: pMen, gender: "Men" });
      }
      if (pWomen !== "") {
        pricesToSet.push({ category_id: null, title: duration, price: pWomen, gender: "Women" });
      }
    }

    const reusedIds = [];
    // Reuse existing records where possible
    for (const existing of existingPrices) {
      if (pricesToSet.length > 0) {
        const nextPrice = pricesToSet.shift();
        await existing.update({
          category_id: nextPrice.category_id,
          title: nextPrice.title,
          price: nextPrice.price,
          gender: nextPrice.gender
        });
        reusedIds.push(existing.id);
      }
    }

    // Create new records for any remaining prices
    for (const nextPrice of pricesToSet) {
      await SubServicePrice.create({
        subservice_id: lastId,
        category_id: nextPrice.category_id,
        title: nextPrice.title,
        price: nextPrice.price,
        gender: nextPrice.gender
      });
    }

    // Clean up or clear unused existing price records
    for (const existing of existingPrices) {
      if (!reusedIds.includes(existing.id)) {
        if (referencedIds.has(existing.id)) {
          console.log(`SubservicePrice ID ${existing.id} is referenced in form_services. Clearing price instead of deleting.`);
          await existing.update({ price: "" });
        } else {
          await existing.destroy();
        }
      }
    }

    res.redirect(siteUrl + "/" + pageUrl);
  },

  getCategory: async function (req, res) {
    try {
      const row = await Category.findAll({
        where: { type: req.body.type },
        include: [
          {
            model: SubServicePrice,
            where: { subservice_id: req.body.subservice_id },
            required: false,
          },
        ],
      });
      res.json(row);
    } catch (error) {
      console.error(`Error occurred on route ${req.originalUrl}:`, error);
      return res
        .status(500)
        .json({
          status: false,
          message: "Something went wrong, please try again",
        });
    }
  },
};