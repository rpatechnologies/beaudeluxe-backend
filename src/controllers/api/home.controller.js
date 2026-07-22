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
          "title" : homePageContentsObj?.banner_screen_title || null,
          "sub_title" : homePageContentsObj?.banner_screen_shadow_title || null,
          "home_banner_video" :  `${siteUrl}/uploads/homepagecontents/${homePageContentsObj?.home_banner_video}`,
      }

      const services = await Service.findAll({
        where: { status: 1, show_on_home: 1 },
        order: [ ['order_number', 'ASC'] ],
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
        where : {show_on_homepage: 1},
        attributes: ["id", "question", "answer", "slug", "status"],
      });

      const arrayfaqs = [];
      for (let k = 0; k < faqs.length; k++) {
        const faqItem = faqs[k];
        const objFaq = {
          id: faqItem.id,
          question: faqItem.question,
          answer: faqItem.answer,
          slug: faqItem.slug,
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
      const rows = await Faq.findAll({
        where: { status : 1},
        order: [["id", "DESC"]],
        attributes: ["id", "question", "answer", "slug"],
      });
      return res.status(200).json({
        status: true,
        message: "Data fetched successfully.",
        data: rows,
      });
    } catch (error) {
      console.log(error);
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
    const cacheKey = "home_content_cache";
    cache.del(cacheKey);
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
        current : currentTime,
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
};
