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
      category_id,
      description,
      duration,
      price,
      status,
      gender,
    } = req.body;

    const formData = {
      title: title,
      service_id: service_id,
      description: description,
      type: category,
      status: status,
      gender: gender || 'Both',
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

    // Fetch all existing price records for this subservice
    const existingPrices = await SubServicePrice.findAll({ where: { subservice_id: lastId } });

    // Track which database price record IDs were updated/created
    const handledIds = [];

    if (Array.isArray(duration)) {
      for (let i = 0; i < duration.length; i++) {
        const submittedPrice = (price[i] || "").trim();
        const submittedTitle = duration[i];
        const submittedCategoryId = category_id ? category_id[i] : null;

        // Try to match existing record by category_id or title fallback
        const matched = existingPrices.find(p => 
          (p.category_id && submittedCategoryId && p.category_id == submittedCategoryId) ||
          (p.title && submittedTitle && p.title.toLowerCase().trim() === submittedTitle.toLowerCase().trim())
        );

        if (matched) {
          await SubServicePrice.update({
            price: submittedPrice,
            category_id: submittedCategoryId || matched.category_id,
            title: submittedTitle
          }, { where: { id: matched.id } });
          handledIds.push(matched.id);
        } else if (submittedPrice !== "") {
          const newPrice = await SubServicePrice.create({
            subservice_id: lastId,
            category_id: submittedCategoryId,
            title: submittedTitle,
            price: submittedPrice,
          });
          handledIds.push(newPrice.id);
        }
      }
    } else if (duration) {
      const submittedPrice = (price || "").trim();
      const matched = existingPrices.find(p => 
        p.title && p.title.toLowerCase().trim() === duration.toLowerCase().trim()
      );

      if (matched) {
        await SubServicePrice.update({
          price: submittedPrice,
          category_id: category_id || matched.category_id,
          title: duration
        }, { where: { id: matched.id } });
        handledIds.push(matched.id);
      } else if (submittedPrice !== "") {
        const newPrice = await SubServicePrice.create({
          subservice_id: lastId,
          category_id: category_id,
          title: duration,
          price: submittedPrice,
        });
        handledIds.push(newPrice.id);
      }
    }

    // Clean up/delete any old price records that were NOT submitted/handled
    for (const oldPrice of existingPrices) {
      if (!handledIds.includes(oldPrice.id)) {
        try {
          await SubServicePrice.destroy({ where: { id: oldPrice.id } });
        } catch (destroyErr) {
          // If referenced by booking (foreign key error), set price to empty string instead of crashing!
          await SubServicePrice.update({ price: "" }, { where: { id: oldPrice.id } });
        }
      }
    }

    res.redirect(siteUrl + "/" + pageUrl);
  },

  getCategory: async function (req, res) {
    try {
      console.log(req.body.subservice_id, "subservice_id");
      const categories = await Category.findAll({
        where: { type: req.body.type }
      });

      const prices = await SubServicePrice.findAll({
        where: { subservice_id: req.body.subservice_id }
      });

      const result = categories.map(cat => {
        const matchedPrice = prices.find(p => 
          (p.category_id && p.category_id === cat.id) || 
          (p.title && p.title.toLowerCase().trim() === cat.title.toLowerCase().trim())
        );
        return {
          id: cat.id,
          type: cat.type,
          title: cat.title,
          status: cat.status,
          createdAt: cat.createdAt,
          updatedAt: cat.updatedAt,
          subservice_prices: matchedPrice ? [matchedPrice] : []
        };
      });

      res.json(result);
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
