const { body, validationResult } = require("express-validator");
const { settingData } = require("../../utils/global.helper");
const models = require("../../models");
const Banner = models.banner;
const Service = models.service;
const HomePageContents = models.homePageContents;
const Testimonials = models.testimonials;
const Cms = models.cms;
const menu = models.menu;
const GeneralSettingsController = models.setting;
const MetaContents = models.metaContents;
const TimeSlots = models.timeSlot;
const TimeSlotValues = models.timeSlotValues;
const Faq = models.faq;
const GiftVoucher = models.giftVouchers;
const Page = models.page;
const SubServices = models.subServices;
const { Op } = require("sequelize");
const moment = require("moment-timezone");
const cache = require("memory-cache");
const fs = require("fs");

const {
  adminEmail,
  adminEmails,
  sendEmail,
  sendMultipleEmail,
} = require("../../services/email.service");

module.exports = {
  home: async function (req, res) {
    const cacheKey = "home_content_cache";

    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      console.log("Cache hit!");
      return res.status(200).json({
        status: true,
        message: "Data fetched successfully.",
        data: cachedData,
      });
    }

    try {
      const homePageContents = await HomePageContents.findAll({
        attributes: ["id", "field", "value", "createdAt", "updatedAt"],
      });
      let homePageContentsObj = {};
      for (let q = 0; q < homePageContents.length; q++) {
        homePageContentsObj[homePageContents[q]["field"]] =
          homePageContents[q]["value"];
      }


      let aboutUsSection = {
        title: homePageContentsObj["screen_two_title"],
        shadowTitle: homePageContentsObj["screen_two_shadow_title"],
        inner_title: homePageContentsObj["screen_two_inner_title"],
        description: homePageContentsObj["screen_two_description"],
        imageUrl: `${siteUrl}/uploads/homepagecontents/${homePageContentsObj["screen_two_image"]}`,
        altTag: homePageContentsObj["screen_two_image_alt_tag"],
      };

      const banner = {
        "title": homePageContentsObj?.banner_screen_title || null,
        "sub_title": homePageContentsObj?.banner_screen_shadow_title || null,
        "home_banner_video": `${siteUrl}/uploads/homepagecontents/${homePageContentsObj?.home_banner_video}`,
      }

      const services = await Service.findAll({
        where: { status: 1, show_on_home: 1 },
        order: [['order_number', 'ASC']],
        limit: 8,
        attributes: [
          "id",
          "title",
          "short_description",
          "slug",
          "order_number",
          "image",
          "altTag",
          "show_in_menu",
          "show_on_home",
          "logo",
          "altTagLogo",
        ],
      });
      let arrayServices = [];
      for (let k = 0; k < services.length; k++) {
        const serviceItem = services[k];
        const objService = {
          id: serviceItem.id,
          title: serviceItem.title,
          short_description: serviceItem.short_description,
          slug: serviceItem.slug,
          order_number: serviceItem.order_number,
          image: `${siteUrl}/uploads/service/${serviceItem.image}`,
          altTag: serviceItem.altTag,
          show_in_menu: serviceItem.show_in_menu,
          show_on_home: serviceItem.show_in_menu,
          logo: `${siteUrl}/uploads/service/${serviceItem.logo}`,
          altTagLogo: serviceItem.altTagLogo,
        };
        arrayServices.push(objService);
      }

      let serviceDict = {
        title: homePageContentsObj["screen_one_title"],
        shadowTitle: homePageContentsObj["screen_one_shadow_title"],
        services: arrayServices,
      };

      let faqs = await Faq.findAll({
        where: { show_on_homepage: 1 },
        attributes: ["id", "question", "answer", "slug", "category", "status"],
      });

      const arrayfaqs = [];
      for (let k = 0; k < faqs.length; k++) {
        const faqItem = faqs[k];
        const objFaq = {
          id: faqItem.id,
          question: faqItem.question,
          answer: faqItem.answer,
          slug: faqItem.slug,
          category: faqItem.category || "About",
          status: faqItem.status,
        };
        arrayfaqs.push(objFaq);
      };

      const testimonials = await Testimonials.findAll({
        where: { status: 1 },
        attributes: [
          "id",
          "name",
          "country",
          "flag",
          "rating",
          "description",
          "photo",
          "altTag",
          "status",
          "publishedAt",
          "slug",
        ],
        order: [["publishedAt", "DESC"]],
      });
      let arrayTestimonials = [];
      for (let i = 0; i < testimonials.length; i++) {
        const itemTestimonials = testimonials[i];
        const objTestimonials = {
          id: itemTestimonials.id,
          name: itemTestimonials.name,
          country: itemTestimonials.country,
          flag: itemTestimonials.flag,
          rating: itemTestimonials.rating,
          description: itemTestimonials.description,
          photo: `${siteUrl}/uploads/testimonials/${itemTestimonials.photo}`,
          altTag: itemTestimonials.altTag,
          slug: itemTestimonials.slug,
          status: itemTestimonials.status,
          publishedAt: itemTestimonials.publishedAt,
        };
        arrayTestimonials.push(objTestimonials);
      }

      let testimonialsDict = {
        title: homePageContentsObj["screen_three_title"],
        shadowTitle: homePageContentsObj["screen_three_shadow_title"],
        testimonials: arrayTestimonials,
      };

      let faqDict = {
        title: homePageContentsObj["screen_faq_title"],
        shadowTitle: homePageContentsObj["screen_faq_shadow_title"],
        faq: arrayfaqs
      };

      let homePageData = [];
      for (let k = 0; k < homePageContents.length; k++) {
        const itemHpc = homePageContents[k];
        const objHpc = {
          id: itemHpc.id,
          field: itemHpc.field,
          value: itemHpc.value,
          createdAt: itemHpc.createdAt,
          updatedAt: itemHpc.updatedAt,
        };
        homePageData.push(objHpc);
      }

      let object = {};
      const setting = await GeneralSettingsController.findAll({});
      for (let i = 0; i < setting.length; i++) {
        const data = setting[i];
        object[data.field] = data.value;
      }
      const response = {
        banner,
        services: serviceDict,
        aboutUsSection: aboutUsSection,
        testimonials: testimonialsDict,
        faqs: faqDict,
        homePageData: homePageData,
        ip: object.ipaddress,
      };

      cache.put(cacheKey, response);
      console.log("Cache miss, data fetched from the database.");

      return res.status(200).json({
        status: true,
        message: "Data fetched successfully.",
        data: response,
      });
    } catch (error) {
      console.log("Error While implementing Home", error);
    }
  },

  aboutUsPost: async function (req, res) {
    try {
      const { slug } = req.body;
      const homePageContents = await HomePageContents.findAll({
        attributes: ["id", "field", "value", "createdAt", "updatedAt"],
      });
      let homePageContentsObj = {};
      for (let q = 0; q < homePageContents.length; q++) {
        homePageContentsObj[homePageContents[q]["field"]] =
          homePageContents[q]["value"];
      }
      const banners = await Banner.findAll({
        where: { status: 1, page_id: 2 },
        attributes: [
          "id",
          "page_id",
          "title",
          "image",
          "altTagImage",
          "image_mob",
          "altTagImageMob",
          "description",
          "status",
          "order_no",
        ],
        order: [["order_no", "ASC"]],
      });
      // console.log(banners);

      const cmsList = await Cms.findAll({
        where: { status: 1, slug: slug },
        attributes: [
          "id",
          "title",
          "shadow_title",
          "description",
          "image",
          "alt_tag",
          "slug",
        ],
      });

      let arrayBanners = {};
      for (let j = 0; j < banners.length; j++) {
        const itemBanner = banners[j];
        arrayBanners = {
          id: itemBanner.id,
          title: itemBanner.title,
          image: `${siteUrl}/uploads/banners/${itemBanner.image}`,
          altTagImage: itemBanner.altTagImage,
          mob_image: `${siteUrl}/uploads/banners/${itemBanner.image_mob}`,
          altTagImageMob: itemBanner.altTagImageMob,
          description: itemBanner.description,
        };
      }

      let arrayCms = {};
      for (let j = 0; j < cmsList.length; j++) {
        const itemBanner = cmsList[j];
        arrayCms = {
          id: itemBanner.id,
          shadow_title: itemBanner.shadow_title,
          title: itemBanner.title,
          image: `${siteUrl}/uploads/cms/${itemBanner.image}`,
          altTag: itemBanner.alt_tag,
          description: itemBanner.description,
        };
      }
      const services = await Service.findAll({
        where: { status: 1, show_on_home: 1 },
        attributes: [
          "id",
          "title",
          "short_description",
          "slug",
          "image",
          "altTag",
          "logo",
          "altTagLogo",
        ],
      });
      let arrayServices = [];
      for (let k = 0; k < services.length; k++) {
        const serviceItem = services[k];
        const objService = {
          id: serviceItem.id,
          title: serviceItem.title,
          short_description: serviceItem.short_description,
          slug: serviceItem.slug,
          image: `${siteUrl}/uploads/service/${serviceItem.image}`,
          altTag: serviceItem.altTag,
          logo: `${siteUrl}/uploads/service/${serviceItem.logo}`,
          altTagLogo: serviceItem.altTagLogo,
        };
        arrayServices.push(objService);
      }

      let serviceDict = {
        title: homePageContentsObj["screen_one_title"],
        shadowTitle: homePageContentsObj["screen_one_shadow_title"],
        services: arrayServices,
      };

      const response = {
        banner: arrayBanners,
        cms: arrayCms,
        services: serviceDict,
      };

      return res.status(200).json({
        status: true,
        message: "Data fetched successfully.",
        data: response,
      });
    } catch (error) {
      // console.log(error);
      console.log("Error While implementing Home");
    }
  },

  info: async function (req, res) {
    try {
      const data = await settingData();
      data["logo"] = `${siteUrl}/uploads/info/${data.logo}`;
      data["footer_logo"] = `${siteUrl}/uploads/info/${data.footer_logo}`;
      data["favicon"] = `${siteUrl}/uploads/info/${data.favicon}`;
      data["partner_icon"] = `${siteUrl}/uploads/info/${data.partner_icon}`;

      return res.status(200).json({
        status: true,
        message: "Data fetched successfully.",
        data: data,
      });
    } catch (error) {
      // console.log(error);
      console.log("Error While implementing About Us");
    }
  },

  cms: async function (req, res) {
    try {
      const { slug } = req.body;

      var cms = await Cms.findOne({ where: { slug: slug } });
      cms["image"] = `${siteUrl}/uploads/cms/${cms["image"]}`;

      return res.status(200).json({
        status: true,
        message: "Data fetched successfully.",
        data: cms,
      });
    } catch (error) {
      console.log(error);
      console.log("Error While implementing Home");
    }
  },

  cmsContent: async function (req, res) {
    try {
      const { slug } = req.body;

      var cms = await Cms.findOne({ where: { slug: slug } });
      var page = await Page.findOne({ where: { slug: slug } });
      var banner = await Banner.findOne({ where: { page_id: page["id"] } });
      // cms['image'] = `${siteUrl}/uploads/cms/${cms['image']}`;
      // banner['image'] = `${siteUrl}/uploads/banners/${banner.image}`;
      // banner['image_mob'] = `${siteUrl}/uploads/banners/${banner.image_mob}`;
      var cmsData = {
        ...cms["dataValues"],
        image: `${siteUrl}/uploads/banners/${banner.image}`,
        mob_image: `${siteUrl}/uploads/banners/${banner.image_mob}`,
      };

      return res.status(200).json({
        status: true,
        message: "Data fetched successfully.",
        data: cmsData,
        cms: cms,
        banner: banner,
      });
    } catch (error) {
      console.log(error);
      console.log("Error While implementing Cms Content");
    }
  },

  metaContents: async function (req, res) {
    try {
      const { slug } = req.body;
      // const pageData = await Page.findOne({where: {slug: slug}});

      let metaContents = await MetaContents.findOne({
        where: { slug: slug },
      });
      if (!metaContents) {
        metaContents = await MetaContents.findOne({
          where: { slug: "home" },
        });
      }
      return res.status(200).json({
        status: true,
        message: "Data fetched successfully.",
        data: metaContents,
      });
    } catch (error) {
      console.log(error);
      console.log("Error While implementing Meta Contents");
    }
  },

  banner: async function (req, res) {
    try {
      const { page_id } = req.body;

      const banner = await Banner.findOne({
        where: { status: 1, page_id: page_id },
        attributes: [
          "id",
          "title",
          "image",
          "altTagImage",
          "image_mob",
          "altTagImageMob",
        ],
      });
      const response = {
        id: banner.id,
        title: banner.title,
        // arrow_title: banner.arrow_title,
        image: `${siteUrl}/uploads/banners/${banner.image}`,
        altTagImage: banner.altTagImage,
        mob_image: `${siteUrl}/uploads/banners/${banner.image_mob}`,
        altTagImageMob: banner.altTagImageMob,
      };

      return res.status(200).json({
        status: true,
        message: "Data fetched successfully.",
        data: response,
      });
    } catch (error) {
      console.log(error);
      console.log("Error While implementing Home");
    }
  },

  faq: async function (req, res) {
    try {
      const selectedCategory = req.query.category;
      let whereClause = { status: 1 };
      if (selectedCategory) {
        whereClause.category = selectedCategory;
      }

      const rows = await Faq.findAll({
        where: whereClause,
        order: [["id", "ASC"]],
        attributes: ["id", "question", "answer", "slug", "category"],
      });

      if (selectedCategory) {
        return res.status(200).json({
          status: true,
          message: "Data fetched successfully.",
          data: rows.map(item => ({
            id: item.id,
            question: item.question,
            answer: item.answer,
            slug: item.slug,
            category: item.category || "About"
          }))
        });
      }

      const categoriesOrder = [
        "About",
        "Booking & Scheduling",
        "Pricing & Payment",
        "Therapist & Team",
        "Service Type",
        "Safety & Hygenic",
        "During the Session"
      ];

      let grouped = {};
      categoriesOrder.forEach(cat => {
        grouped[cat] = [];
      });

      rows.forEach(item => {
        const cat = item.category || "About";
        if (!grouped[cat]) {
          grouped[cat] = [];
        }
        grouped[cat].push({
          id: item.id,
          question: item.question,
          answer: item.answer,
          slug: item.slug,
          category: cat
        });
      });

      return res.status(200).json({
        status: true,
        message: "Data fetched successfully.",
        data: {
          categories: categoriesOrder,
          grouped: grouped,
          list: rows.map(item => ({
            id: item.id,
            question: item.question,
            answer: item.answer,
            slug: item.slug,
            category: item.category || "About"
          }))
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: false,
        message: error.message
      });
    }
  },

  getMenu: async function (req, res) {
    try {
      const headerMenu = await menu.findAll({
        where: { status: 1, type: 1 },
        attributes: ["id", "type", "title", "slug", "isMobile"],
      });
      const footerMenu = await menu.findAll({
        where: { status: 1, type: 2 },
        attributes: ["id", "type", "title", "slug", "isMobile"],
      });
      const cmsFooterMenu = await menu.findAll({
        where: { status: 1, type: 3 },
        attributes: ["id", "type", "title", "slug", "isMobile"],
      });
      const cmsMenu = await Cms.findAll({ where: { status: 1 } });
      const generalSiteSettings = await GeneralSettingsController.findAll({});
      const serviceMenu = await Service.findAll({
        where: { status: 1, show_in_menu: 1 },
        attributes: ["id", "title", "slug"],
      });

      const ServiceTitleSlugDict = await menu.findOne({
        where: { slug: "/services" },
      });

      const services = {
        title: ServiceTitleSlugDict["title"],
        slug: ServiceTitleSlugDict["slug"],
        services: serviceMenu,
      };

      let generalSiteSettingsDict = {};
      for (let i = 0; i < generalSiteSettings.length; i++) {
        const item = generalSiteSettings[i];
        generalSiteSettingsDict[generalSiteSettings[i]["field"]] =
          generalSiteSettings[i]["value"];
      }

      const response = {
        headerLogo: `${siteUrl}/uploads/info/${generalSiteSettingsDict["logo"]}`,
        headerLogoAltTag: generalSiteSettingsDict["altTagHeaderLogo"],
        footerLogo: `${siteUrl}/uploads/info/${generalSiteSettingsDict["footer_logo"]}`,
        footerLogoAltTag: generalSiteSettingsDict["altTagFooterLogo"],
        partnerLogo: `${siteUrl}/uploads/info/${generalSiteSettingsDict["partner_icon"]}`,
        partnerLogoAltTag: generalSiteSettingsDict["alt_tag_partner_icon"],
        copyright: generalSiteSettingsDict["copyright_text"],
        address: generalSiteSettingsDict["address"],
        contact: generalSiteSettingsDict["contact"],
        email: generalSiteSettingsDict["email"],
        header: headerMenu,
        footer: footerMenu,
        cms: cmsMenu,
        cmsFooterMenu,
        service: serviceMenu,
        services: services,
        about_text_footer: generalSiteSettingsDict["about_text_footer"],
      };

      return res.status(200).json({
        status: true,
        message: "Data fetched successfully.",
        data: response,
      });
    } catch (error) {
      console.log(error);
      console.log("Error While implementing Home");
    }
  },

  sitemap: async function (req, res) {
    try {
      const headerMenu = await menu.findAll({
        where: { status: 1, slug: { [Op.notIn]: ["/sitemap", "#"] } },
      });

      // const serviceMenu = await Service.findAll({
      //   where: { status: 1 },
      //   attributes: ["id", "title", "slug"],
      // });
      const serviceMenu = await Service.findAll({
        attributes: ["id", "title", "slug"],
        where: { status: 1 },
        include: [
          {
            model: SubServices,
            attributes: ["id", "title", "slug"],
            where: { status: 1 },
          },
        ],
      });

      var sitemapDict = {};
      const hmCount = headerMenu.length;
      for (let i = 0; i < hmCount; i++) {
        sitemapDict[headerMenu[i]["title"]] = {
          title: headerMenu[i]["title"],
          slug: headerMenu[i]["slug"],
        };
      }
      var serviceList = [];
      const serviceCount = serviceMenu.length;

      for (let i = 0; i < serviceCount; i++) {
        let subServicesList = [];

        if (
          serviceMenu[i].sub_services &&
          serviceMenu[i].sub_services.length > 0
        ) {
          subServicesList = serviceMenu[i].sub_services.map((subService) => ({
            title: subService.title,
            slug: "#",
          }));
        }

        serviceList.push({
          title: serviceMenu[i]["title"],
          slug: `/services/${serviceMenu[i]["slug"]}`,
          subServices: subServicesList,
        });
      }

      var tempServiceDict = sitemapDict["Services"];
      sitemapDict["Services"] = {
        title: tempServiceDict["title"],
        slug: tempServiceDict["slug"],
        services: serviceList,
      };
      var result = Object.values(sitemapDict);

      return res.status(200).json({
        status: true,
        message: "Data fetched successfully.",
        data: result,
      });
    } catch (error) {
      console.log(error);
      console.log("Error while implementing Sitemap");
    }
  },
  clearHomeCache: async function (req, res) {
    cache.clear();
    res.send("Cache cleared!");
  },

  get_timeslot: async function (req, res) {
    const startDate = req.query.startDate || null;
    try {
      const currentDate = moment().tz("Asia/Dubai").format("YYYY-MM-DD");
      const currentTime = moment()
        .tz("Asia/Dubai")
        .add(1, "hour")
        .format("HH:mm:ss");
      console.log(currentTime)
      let timeslot = [];
      if (startDate === currentDate) {
        timeslot = await TimeSlotValues.findAll({
          where: {
            date: startDate,
            start_time: {
              [Op.gt]: currentTime,
            },
          },
          attributes: ["id", "start_time", "end_time", "date"],
          order: [["start_time", "ASC"]]
        });
      } else if (startDate > currentDate) {
        timeslot = await TimeSlotValues.findAll({
          where: { date: startDate },
          attributes: ["id", "start_time", "end_time", "date"],
          order: [["start_time", "ASC"]]
        });
      }

      return res.status(200).json({
        status: true,
        message: "Time slots fetched successfully.",
        current: currentTime,
        data: timeslot
      });
    } catch (error) {
      console.log(error);
    }
  },

  gift_voucher: async function (req, res) {
    // const object = {
    //   name:"devendra",
    //   email:"deven1606@gmail.com",
    //   phone_no:"8982231555",
    //   location:"fsdfsdfsd",
    //   services:"fsdfsdafs",
    //   date:"Fsdfsadfds",
    //   time: 'slot',
    // };
    // await sendEmail('deven1606@gmail.com', "CONTACT_ENQ_USER", null, object);
    try {
      const giftVoucher = await GiftVoucher.findAll({
        where: { status: 1 },
        attributes: ["id", "title", "description", "image"],
      });

      let giftVouchersArray = [];

      for (let element of giftVoucher) {
        giftVouchersArray.push({
          id: element.id,
          title: element.title,
          description: element.description,
          image: `${siteUrl}/uploads/gift_voucher/${element.image}`,
        });
      }
      const banners = await Banner.findOne({
        where: { status: 1, page_id: 10 },
        attributes: ["id", "title", "description", "image", "image_mob"],
      });
      let bannerData = null;

      if (banners) {
        bannerData = {
          ...banners.toJSON(),
          image: `${siteUrl}/uploads/banners/${banners.image}`,
          image_mob: `${siteUrl}/uploads/banners/${banners.image_mob}`,
        };
      }

      let titles = {
        shadow_title: "Gift",
        subtitle: "Gift Vouchers",
        paragraph:
          "Choose whether you wish to offer particular services from our list or a gift voucher with the amount of your choice.",
      };

      return res.status(200).json({
        status: true,
        message: "Gift vouchers fetched successfully.",
        data: { giftVouchersArray, banner: bannerData, titles },
      });
    } catch (error) {
      console.log(error);
    }
  },

  getHomePageSections: async function (req, res) {
    const faqType = req.query.faq_type || req.query.type || req.query.category || "";
    const cacheKey = `home_page_sections_cache_${faqType}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.status(200).json({
        status: true,
        message: "Data fetched successfully.",
        data: cachedData,
      });
    }

    try {
      const homePageContents = await HomePageContents.findAll({
        attributes: ["id", "field", "value", "createdAt", "updatedAt"],
      });
      let homePageContentsObj = {};
      for (let q = 0; q < homePageContents.length; q++) {
        homePageContentsObj[homePageContents[q]["field"]] =
          homePageContents[q]["value"];
      }

      // 1. Home Massage Section
      let homeMassageSection = {
        title: homePageContentsObj["home_massage_title"] || null,
        intro: homePageContentsObj["home_massage_intro"] || null,
        rightParas: homePageContentsObj["home_massage_right_paras"] || null,
        image1: homePageContentsObj["home_massage_image_1"] ? `${siteUrl}/uploads/homepagecontents/${homePageContentsObj["home_massage_image_1"]}` : null,
        image2: homePageContentsObj["home_massage_image_2"] ? `${siteUrl}/uploads/homepagecontents/${homePageContentsObj["home_massage_image_2"]}` : null
      };

      // 2. Why Choose Section
      let whyChooseCards = [];
      try {
        if (homePageContentsObj["why_choose_cards"]) {
          whyChooseCards = JSON.parse(homePageContentsObj["why_choose_cards"]);
        }
      } catch (e) {
        console.error("Error parsing why_choose_cards:", e);
      }
      let whyChooseSection = {
        title: homePageContentsObj["why_choose_title"] || null,
        description: homePageContentsObj["why_choose_description"] || null,
        cards: whyChooseCards
      };

      // 3. Services Offered Section
      let servicesOfferedSection = {
        title: homePageContentsObj["services_offered_title"] || null,
        intro: homePageContentsObj["services_offered_intro"] || null,
        mainImage: homePageContentsObj["services_offered_main_image"] ? `${siteUrl}/uploads/homepagecontents/${homePageContentsObj["services_offered_main_image"]}` : null,
        qa1Title: homePageContentsObj["services_offered_qa1_title"] || null,
        qa1Content: homePageContentsObj["services_offered_qa1_content"] || null,
        qa2Title: homePageContentsObj["services_offered_qa2_title"] || null,
        qa2Content: homePageContentsObj["services_offered_qa2_content"] || null
      };

      // 4. Massage Types Section (Subservices from all services)
      let massageTypesCards = [];
      try {
        let staticCards = [];
        if (homePageContentsObj["massage_types_cards"]) {
          try {
            staticCards = JSON.parse(homePageContentsObj["massage_types_cards"]);
          } catch (e) {
            console.error("Error parsing massage_types_cards:", e);
          }
        }

        const subServicesList = await SubServices.findAll({
          where: { status: 1 },
          order: [['order_no', 'ASC']],
          attributes: [
            "id",
            "service_id",
            "title",
            "description",
            "slug",
            "order_no",
            "gender",
            "type",
            "image",
            "altTag",
          ],
          include: [{
            model: Service,
            attributes: ["slug"]
          }]
        });

        massageTypesCards = subServicesList.map(subService => {
          const matchedCard = staticCards.find(card => {
            if (!card.title || !subService.title) return false;
            const t1 = card.title.trim().toLowerCase();
            const t2 = subService.title.trim().toLowerCase();
            if (t1 === t2) return true;
            if (t1.includes(t2) || t2.includes(t1)) return true;
            const firstWord1 = t1.split(/[\s(&]/)[0];
            const firstWord2 = t2.split(/[\s(&]/)[0];
            if (firstWord1 && firstWord2 && firstWord1 === firstWord2 && firstWord1.length > 3) return true;
            return false;
          });

          // Use subservice image if uploaded, fallback to matched static card image
          const imageUrl = subService.image
            ? `${siteUrl}/uploads/sub_service/${subService.image}`
            : (matchedCard && matchedCard.image ? `${siteUrl}/uploads/homepagecontents/${matchedCard.image}` : null);

          // Use subservice description if uploaded, fallback to matched card description
          const description = subService.description && subService.description.trim() !== ""
            ? subService.description
            : (matchedCard && matchedCard.description ? matchedCard.description : "");

          // Use subservice altTag if uploaded, fallback to matched card title or subservice title
          const altTag = subService.altTag && subService.altTag.trim() !== ""
            ? subService.altTag
            : (matchedCard && matchedCard.title ? matchedCard.title : (subService.title || ""));

          return {
            id: subService.id,
            title: subService.title || "",
            image: imageUrl,
            altTag: altTag,
            description: description,
            slug: subService.slug || (subService.service ? subService.service.slug : ""),
            service_id: subService.service_id,
            type: subService.type,
            gender: subService.gender
          };
        });
      } catch (e) {
        console.error("Error fetching subservices for massage_types_cards:", e);
      }
      let massageTypesSection = {
        title: homePageContentsObj["massage_types_title"] || null,
        description: homePageContentsObj["massage_types_description"] || null,
        cards: massageTypesCards
      };

      // 5. Health Benefits Section
      let healthBenefitsCards = [];
      try {
        if (homePageContentsObj["health_benefits_cards"]) {
          const parsedCards = JSON.parse(homePageContentsObj["health_benefits_cards"]);
          healthBenefitsCards = parsedCards.map(card => ({
            id: card.id,
            number: card.number || "",
            title: card.title || "",
            image: card.image ? `${siteUrl}/uploads/homepagecontents/${card.image}` : null,
            description: card.description || ""
          }));
        }
      } catch (e) {
        console.error("Error parsing health_benefits_cards:", e);
      }
      let healthBenefitsSection = {
        title: homePageContentsObj["health_benefits_title"] || null,
        description: homePageContentsObj["health_benefits_description"] || null,
        cards: healthBenefitsCards
      };

      // 6. Safety & Privacy Section
      let safetyPrivacyCards = [];
      try {
        if (homePageContentsObj["safety_privacy_cards"]) {
          const parsedCards = JSON.parse(homePageContentsObj["safety_privacy_cards"]);
          safetyPrivacyCards = parsedCards.map(card => ({
            id: card.id,
            title: card.title || "",
            image: card.image ? `${siteUrl}/uploads/homepagecontents/${card.image}` : null,
            description: card.description || ""
          }));
        }
      } catch (e) {
        console.error("Error parsing safety_privacy_cards:", e);
      }
      let safetyPrivacySection = {
        title: homePageContentsObj["safety_privacy_title"] || null,
        description: homePageContentsObj["safety_privacy_description"] || null,
        cards: safetyPrivacyCards
      };

      // 7. Booking Steps Section
      let bookingStepsCards = [];
      try {
        if (homePageContentsObj["booking_steps_cards"]) {
          const parsedCards = JSON.parse(homePageContentsObj["booking_steps_cards"]);
          bookingStepsCards = parsedCards.map(card => ({
            id: card.id,
            number: card.number || "",
            title: card.title || "",
            image: card.image ? `${siteUrl}/uploads/homepagecontents/${card.image}` : null,
            description: card.description || ""
          }));
        }
      } catch (e) {
        console.error("Error parsing booking_steps_cards:", e);
      }
      let bookingStepsSection = {
        title: homePageContentsObj["booking_steps_title"] || null,
        description: homePageContentsObj["booking_steps_description"] || null,
        cards: bookingStepsCards
      };

      // 8. Massage Cost Section
      let massageCostSection = {
        title: homePageContentsObj["massage_cost_title"] || null,
        description: homePageContentsObj["massage_cost_description"] || null,
        boxTitle: homePageContentsObj["massage_cost_box_title"] || null,
        boxBullets: homePageContentsObj["massage_cost_box_bullets"] || null
      };

      // 9. Areas Covered Section
      let areasCoveredCards = [];
      try {
        if (homePageContentsObj["areas_covered_cards"]) {
          const parsedCards = JSON.parse(homePageContentsObj["areas_covered_cards"]);
          areasCoveredCards = parsedCards.map(card => ({
            id: card.id,
            title: card.title || "",
            description: card.description || ""
          }));
        }
      } catch (e) {
        console.error("Error parsing areas_covered_cards:", e);
      }
      let areasCoveredSection = {
        title: homePageContentsObj["areas_covered_title"] || null,
        description: homePageContentsObj["areas_covered_description"] || null,
        cards: areasCoveredCards
      };

      // 10. Massage Legal Section
      let massageLegalItems = [];
      try {
        if (homePageContentsObj["massage_legal_items"]) {
          const parsedItems = JSON.parse(homePageContentsObj["massage_legal_items"]);
          massageLegalItems = parsedItems.map(item => ({
            id: item.id,
            title: item.title || "",
            description: item.description || ""
          }));
        }
      } catch (e) {
        console.error("Error parsing massage_legal_items:", e);
      }
      let massageLegalSection = {
        title: homePageContentsObj["massage_legal_title"] || null,
        description: homePageContentsObj["massage_legal_description"] || null,
        image: homePageContentsObj["massage_legal_image"] ? `${siteUrl}/uploads/homepagecontents/${homePageContentsObj["massage_legal_image"]}` : null,
        items: massageLegalItems
      };

      // 11. Get Started Section
      let getStartedSection = {
        title: homePageContentsObj["get_started_title"] || null,
        description: homePageContentsObj["get_started_description"] || null,
        image: homePageContentsObj["get_started_image"] ? `${siteUrl}/uploads/homepagecontents/${homePageContentsObj["get_started_image"]}` : null
      };

      // 12. Faqs Section
      let faqWhereClause = { status: 1 };
      if (faqType) {
        faqWhereClause.category = faqType;
      } else {
        faqWhereClause.show_on_homepage = 1;
      }

      const faqs = await Faq.findAll({
        where: faqWhereClause,
        order: [["id", "ASC"]],
        attributes: ["id", "question", "answer", "slug", "category", "status"],
      });

      const arrayfaqs = [];
      for (let k = 0; k < faqs.length; k++) {
        const faqItem = faqs[k];
        const objFaq = {
          id: faqItem.id,
          question: faqItem.question,
          answer: faqItem.answer,
          slug: faqItem.slug,
          category: faqItem.category || "About",
          status: faqItem.status,
        };
        arrayfaqs.push(objFaq);
      }

      let faqsSection = {
        title: homePageContentsObj["screen_faq_title"] || null,
        shadowTitle: homePageContentsObj["screen_faq_shadow_title"] || null,
        faq: arrayfaqs
      };

      // 13. Testimonials Section
      const testimonials = await Testimonials.findAll({
        where: { status: 1 },
        attributes: [
          "id",
          "name",
          "country",
          "flag",
          "rating",
          "description",
          "photo",
          "altTag",
          "status",
          "publishedAt",
          "slug",
        ],
        order: [["publishedAt", "DESC"]],
      });
      let arrayTestimonials = [];
      for (let i = 0; i < testimonials.length; i++) {
        const itemTestimonials = testimonials[i];
        const objTestimonials = {
          id: itemTestimonials.id,
          name: itemTestimonials.name,
          country: itemTestimonials.country,
          flag: itemTestimonials.flag,
          rating: itemTestimonials.rating,
          description: itemTestimonials.description,
          photo: `${siteUrl}/uploads/testimonials/${itemTestimonials.photo}`,
          altTag: itemTestimonials.altTag,
          slug: itemTestimonials.slug,
          status: itemTestimonials.status,
          publishedAt: itemTestimonials.publishedAt,
        };
        arrayTestimonials.push(objTestimonials);
      }

      let testimonialsSection = {
        title: homePageContentsObj["screen_three_title"] || null,
        shadowTitle: homePageContentsObj["screen_three_shadow_title"] || null,
        testimonials: arrayTestimonials,
      };

      const response = {
        homeMassageSection,
        whyChooseSection,
        servicesOfferedSection,
        massageTypesSection,
        healthBenefitsSection,
        safetyPrivacySection,
        bookingStepsSection,
        massageCostSection,
        areasCoveredSection,
        massageLegalSection,
        getStartedSection,
        testimonials: testimonialsSection,
        faqs: faqsSection
      };

      cache.put(cacheKey, response);

      return res.status(200).json({
        status: true,
        message: "Data fetched successfully.",
        data: response,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },

  getFemaleMassageSections: async function (req, res) {
    const cacheKey = "female_massage_sections_cache";
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.status(200).json({
        status: true,
        message: "Data fetched successfully.",
        data: cachedData,
      });
    }

    try {
      const homePageContents = await HomePageContents.findAll({
        attributes: ["id", "field", "value"],
      });
      let homePageContentsObj = {};
      for (let q = 0; q < homePageContents.length; q++) {
        homePageContentsObj[homePageContents[q]["field"]] =
          homePageContents[q]["value"];
      }

      // 1. Women Massage Cost Section
      let womenMassageCostRows = [];
      try {
        if (homePageContentsObj["women_massage_cost_rows"]) {
          womenMassageCostRows = JSON.parse(homePageContentsObj["women_massage_cost_rows"]);
        }
      } catch (e) {
        console.error("Error parsing women_massage_cost_rows:", e);
      }
      let womenMassageCostSection = {
        title: homePageContentsObj["women_massage_cost_title"] || null,
        description: homePageContentsObj["women_massage_cost_description"] || null,
        rows: womenMassageCostRows
      };

      // 2. Women Areas Covered Section
      let womenAreasCoveredCards = [];
      try {
        if (homePageContentsObj["women_areas_covered_cards"]) {
          womenAreasCoveredCards = JSON.parse(homePageContentsObj["women_areas_covered_cards"]);
        }
      } catch (e) {
        console.error("Error parsing women_areas_covered_cards:", e);
      }
      let womenAreasCoveredSection = {
        title: homePageContentsObj["women_areas_covered_title"] || null,
        description: homePageContentsObj["women_areas_covered_description"] || null,
        cards: womenAreasCoveredCards
      };

      // 3. Women Subservices Section
      let staticCards = [];
      if (homePageContentsObj["massage_types_cards"]) {
        try {
          staticCards = JSON.parse(homePageContentsObj["massage_types_cards"]);
        } catch (e) {
          console.error("Error parsing massage_types_cards:", e);
        }
      }

      const subServicesList = await SubServices.findAll({
        where: { status: 1, gender: { [Op.in]: ["Women"] } },
        order: [['order_no', 'ASC']],
        attributes: [
          "id",
          "service_id",
          "title",
          "description",
          "slug",
          "order_no",
          "gender",
          "type",
          "image",
          "altTag",
        ],
        include: [{
          model: Service,
          attributes: ["slug"]
        }]
      });

      const womenSubServices = subServicesList.map(subService => {
        const matchedCard = staticCards.find(card => {
          if (!card.title || !subService.title) return false;
          const t1 = card.title.trim().toLowerCase();
          const t2 = subService.title.trim().toLowerCase();
          if (t1 === t2) return true;
          if (t1.includes(t2) || t2.includes(t1)) return true;
          const firstWord1 = t1.split(/[\s(&]/)[0];
          const firstWord2 = t2.split(/[\s(&]/)[0];
          if (firstWord1 && firstWord2 && firstWord1 === firstWord2 && firstWord1.length > 3) return true;
          return false;
        });

        // Use subservice image if uploaded, fallback to matched static card image
        const imageUrl = subService.image
          ? `${siteUrl}/uploads/sub_service/${subService.image}`
          : (matchedCard && matchedCard.image ? `${siteUrl}/uploads/homepagecontents/${matchedCard.image}` : null);

        // Use subservice description if uploaded, fallback to matched card description
        const description = subService.description && subService.description.trim() !== ""
          ? subService.description
          : (matchedCard && matchedCard.description ? matchedCard.description : "");

        // Use subservice altTag if uploaded, fallback to matched card title or subservice title
        const altTag = subService.altTag && subService.altTag.trim() !== ""
          ? subService.altTag
          : (matchedCard && matchedCard.title ? matchedCard.title : (subService.title || ""));

        return {
          id: subService.id,
          title: subService.title || "",
          image: imageUrl,
          altTag: altTag,
          description: description,
          slug: subService.slug || (subService.service ? subService.service.slug : ""),
          service_id: subService.service_id,
          type: subService.type,
          gender: subService.gender
        };
      });

      const response = {
        womenMassageCostSection,
        womenAreasCoveredSection,
        womenSubServices
      };

      cache.put(cacheKey, response);

      return res.status(200).json({
        status: true,
        message: "Data fetched successfully.",
        data: response,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },

  getAboutPageSections: async function (req, res) {
    const cacheKey = "about_page_sections_cache";
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.status(200).json({
        status: true,
        message: "Data fetched successfully.",
        data: cachedData,
      });
    }

    try {
      const homePageContents = await HomePageContents.findAll({
        attributes: ["id", "field", "value", "createdAt", "updatedAt"],
      });
      let contentsObj = {};
      for (let q = 0; q < homePageContents.length; q++) {
        contentsObj[homePageContents[q]["field"]] = homePageContents[q]["value"];
      }

      // 1. Story Section
      let storySection = {
        mainTitle: contentsObj["about_story_main_title"] || null,
        howContent: contentsObj["about_story_how_content"] || null,
        image1: contentsObj["about_story_image_1"] ? `${siteUrl}/uploads/homepagecontents/${contentsObj["about_story_image_1"]}` : null,
        image2: contentsObj["about_story_image_2"] ? `${siteUrl}/uploads/homepagecontents/${contentsObj["about_story_image_2"]}` : null,
        image3: contentsObj["about_story_image_3"] ? `${siteUrl}/uploads/homepagecontents/${contentsObj["about_story_image_3"]}` : null
      };

      // 2. Mission Section
      let missionSection = {
        missionTitle: contentsObj["about_mission_title"] || null,
        missionContent: contentsObj["about_mission_content"] || null,
      };

      // 3. Numbers Section
      let numbersSection = {
        mainTitle: contentsObj["about_numbers_title"] || null,
        stats: [
          { num: contentsObj["about_numbers_stat1_num"] || null, label: contentsObj["about_numbers_stat1_label"] || null },
          { num: contentsObj["about_numbers_stat2_num"] || null, label: contentsObj["about_numbers_stat2_label"] || null },
          { num: contentsObj["about_numbers_stat3_num"] || null, label: contentsObj["about_numbers_stat3_label"] || null },
          { num: contentsObj["about_numbers_stat4_num"] || null, label: contentsObj["about_numbers_stat4_label"] || null },
          { num: contentsObj["about_numbers_stat5_num"] || null, label: contentsObj["about_numbers_stat5_label"] || null }
        ]
      };

      // 4. Team Section
      let teamMembers = [];
      try {
        const Therapist = models.therapist || require("../../models").therapist;
        const therapistsList = await Therapist.findAll({
          where: { status: 1 },
          order: [["order_number", "ASC"], ["id", "DESC"]]
        });

        teamMembers = therapistsList.map(item => ({
          id: item.id,
          name: item.name,
          role: item.designation || "",
          image: item.image ? `${siteUrl}/uploads/therapist/${item.image}` : null
        }));
      } catch (e) {
        console.error("Error fetching therapists for about page:", e);
      }
      let teamSection = {
        // title: contentsObj["about_team_title"] || null,
        // description: contentsObj["about_team_description"] || null,
        members: teamMembers
      };

      // 5. Contact Section
      let contactCards = [];
      try {
        if (contentsObj["about_contact_cards"]) {
          const parsedCards = JSON.parse(contentsObj["about_contact_cards"]);
          contactCards = parsedCards.map(c => ({
            id: c.id,
            title: c.title || "",
            description: c.description || ""
          }));
        } else {
          contactCards = [
            { title: contentsObj["about_contact_card1_title"] || null, description: contentsObj["about_contact_card1_desc"] || null },
            { title: contentsObj["about_contact_card2_title"] || null, description: contentsObj["about_contact_card2_desc"] || null },
            { title: contentsObj["about_contact_card3_title"] || null, description: contentsObj["about_contact_card3_desc"] || null }
          ];
        }
      } catch (e) {
        console.error("Error parsing about_contact_cards:", e);
      }

      let contactSection = {
        title: contentsObj["about_contact_title"] || null,
        description: contentsObj["about_contact_description"] || null,
        cards: contactCards
      };

      const response = {
        storySection,
        missionSection,
        numbersSection,
        teamSection,
        contactSection
      };

      cache.put(cacheKey, response);

      return res.status(200).json({
        status: true,
        message: "Data fetched successfully.",
        data: response,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },

  getOurTeams: async function (req, res) {
    const cacheKey = "our_teams_roster_cache";
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.status(200).json({
        status: true,
        message: "Data fetched successfully.",
        data: cachedData,
      });
    }

    try {
      const homePageContents = await HomePageContents.findAll({
        attributes: ["id", "field", "value"],
      });
      let contentsObj = {};
      for (let q = 0; q < homePageContents.length; q++) {
        contentsObj[homePageContents[q]["field"]] = homePageContents[q]["value"];
      }

      // let founderSection = {
      //   title: contentsObj["therapist_founder_title"] || "A Note from Our Founder",
      //   quote: contentsObj["therapist_founder_quote"] || "I founded BeauDeluxe because Dubai deserved home massage service that felt as reliable as a good hotel spa. I do not practice myself. My job is to find the best therapists in this city, treat them well, and keep the quality bar high. Every person on this page is someone I would trust with my own family.",
      //   name: contentsObj["therapist_founder_name"] || "El Hassan Elfadli",
      //   role: contentsObj["therapist_founder_role"] || "Founder, BeauDeluxe.",
      //   image: contentsObj["therapist_founder_image"] ? `${siteUrl}/uploads/homepagecontents/${contentsObj["therapist_founder_image"]}` : null
      // };

      // let specializationCards = [];
      // try {
      //   if (contentsObj["therapist_specialization_cards"]) {
      //     specializationCards = JSON.parse(contentsObj["therapist_specialization_cards"]);
      //   } else {
      //     specializationCards = [
      //       { id: 0, title: 'Swedish Massage Specialists', description: 'Therapists certified and experienced in all five classical Swedish techniques (effleurage, petrissage, tapotement, friction, vibration) : Sofia Martins', link_text: 'Book via swedish massage at home.' },
      //       { id: 1, title: 'Deep Tissue Specialists', description: 'Therapists trained in myofascial release, trigger point therapy, cross-fiber friction, and stripping techniques for chronic muscle tension work: Elena Petrova', link_text: 'Book via deep tissue massage at home.' },
      //       { id: 2, title: 'Prenatal and Postnatal Specialists', description: 'Therapists with specific pregnancy massage certification and supervised prenatal training, familiar with side-lying positioning and safe technique adaptation: Fatima Al Mansoori', link_text: 'Details on Pregnancy Massage page.' },
      //       { id: 3, title: 'Sports and Deep Recovery Specialists', description: 'Therapists with sports massage certification for pre-event preparation, post-event recovery, and chronic athletic injury support: Aisha Khan', link_text: 'Details on Sports Massage page.' },
      //       { id: 4, title: 'Female Therapists', description: 'Female certified therapists available by request and by default for women\'s bookings: Maria Gonzalez', link_text: 'Details on massage service for women .' }
      //     ];
      //   }
      // } catch (e) {
      //   console.error("Error parsing therapist_specialization_cards:", e);
      // }

      // let specializationSection = {
      //   title: contentsObj["therapist_specialization_title"] || "Our Therapists by Specialization",
      //   description: contentsObj["therapist_specialization_description"] || "Different massage types require different training. Below is the team's specialization map.",
      //   cards: specializationCards
      // };

      const Therapist = models.therapist || require("../../models").therapist;
      const therapistsList = await Therapist.findAll({
        where: { status: 1 },
        order: [["order_number", "ASC"], ["id", "DESC"]]
      });

      const formattedTherapists = therapistsList.map(item => {
        const specializationsArray = (item.specializations || '')
          .split(/,|\n/)
          .map(s => s.trim())
          .filter(Boolean);

        const certificationsArray = (item.certifications || '')
          .split('\n')
          .map(c => c.trim())
          .filter(Boolean);

        return {
          id: item.id,
          name: item.name,
          designation: item.designation,
          experience: item.experience,
          image: item.image ? `${siteUrl}/uploads/therapist/${item.image}` : null,
          altTag: item.altTag || item.name,
          specializations: specializationsArray,
          certifications: certificationsArray,
          order_number: item.order_number
        };
      });

      const response = {
        // founderSection,
        // specializationSection,
        teams: formattedTherapists
      };

      cache.put(cacheKey, response);

      return res.status(200).json({
        status: true,
        message: "Data fetched successfully.",
        data: response,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },

  therapists: async function (req, res) {
    const cacheKey = "therapists_cache";
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.status(200).json({
        status: true,
        message: "Data fetched successfully.",
        data: cachedData,
      });
    }

    try {
      const homePageContents = await HomePageContents.findAll({
        attributes: ["id", "field", "value"],
      });
      let contentsObj = {};
      for (let q = 0; q < homePageContents.length; q++) {
        contentsObj[homePageContents[q]["field"]] = homePageContents[q]["value"];
      }

      let founderSection = {
        title: contentsObj["therapist_founder_title"] || "A Note from Our Founder",
        quote: contentsObj["therapist_founder_quote"] || "I founded BeauDeluxe because Dubai deserved home massage service that felt as reliable as a good hotel spa. I do not practice myself. My job is to find the best therapists in this city, treat them well, and keep the quality bar high. Every person on this page is someone I would trust with my own family.",
        name: contentsObj["therapist_founder_name"] || "El Hassan Elfadli",
        role: contentsObj["therapist_founder_role"] || "Founder, BeauDeluxe.",
        image: contentsObj["therapist_founder_image"] ? `${siteUrl}/uploads/homepagecontents/${contentsObj["therapist_founder_image"]}` : null
      };

      let specializationCards = [];
      try {
        if (contentsObj["therapist_specialization_cards"]) {
          specializationCards = JSON.parse(contentsObj["therapist_specialization_cards"]);
        } else {
          specializationCards = [
            { id: 0, title: 'Swedish Massage Specialists', description: 'Therapists certified and experienced in all five classical Swedish techniques (effleurage, petrissage, tapotement, friction, vibration) : Sofia Martins', link_text: 'Book via swedish massage at home.' },
            { id: 1, title: 'Deep Tissue Specialists', description: 'Therapists trained in myofascial release, trigger point therapy, cross-fiber friction, and stripping techniques for chronic muscle tension work: Elena Petrova', link_text: 'Book via deep tissue massage at home.' },
            { id: 2, title: 'Prenatal and Postnatal Specialists', description: 'Therapists with specific pregnancy massage certification and supervised prenatal training, familiar with side-lying positioning and safe technique adaptation: Fatima Al Mansoori', link_text: 'Details on Pregnancy Massage page.' },
            { id: 3, title: 'Sports and Deep Recovery Specialists', description: 'Therapists with sports massage certification for pre-event preparation, post-event recovery, and chronic athletic injury support: Aisha Khan', link_text: 'Details on Sports Massage page.' },
            { id: 4, title: 'Female Therapists', description: 'Female certified therapists available by request and by default for women\'s bookings: Maria Gonzalez', link_text: 'Details on massage service for women .' }
          ];
        }
      } catch (e) {
        console.error("Error parsing therapist_specialization_cards:", e);
      }

      let specializationSection = {
        title: contentsObj["therapist_specialization_title"] || "Our Therapists by Specialization",
        description: contentsObj["therapist_specialization_description"] || "Different massage types require different training. Below is the team's specialization map.",
        cards: specializationCards
      };

      const Therapist = models.therapist || require("../../models").therapist;
      const therapistsList = await Therapist.findAll({
        where: { status: 1 },
        order: [["order_number", "ASC"], ["id", "DESC"]]
      });

      const formattedTherapists = therapistsList.map(item => {
        const specializationsArray = (item.specializations || '')
          .split(/,|\n/)
          .map(s => s.trim())
          .filter(Boolean);

        const certificationsArray = (item.certifications || '')
          .split('\n')
          .map(c => c.trim())
          .filter(Boolean);

        return {
          id: item.id,
          name: item.name,
          designation: item.designation,
          experience: item.experience,
          image: item.image ? `${siteUrl}/uploads/therapist/${item.image}` : null,
          altTag: item.altTag || item.name,
          specializations: specializationsArray,
          certifications: certificationsArray,
          order_number: item.order_number
        };
      });

      const response = {
        founderSection,
        specializationSection,
        teams: formattedTherapists
      };

      cache.put(cacheKey, response);

      return res.status(200).json({
        status: true,
        message: "Data fetched successfully.",
        data: response,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },
};
