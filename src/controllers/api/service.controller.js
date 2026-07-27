// const { body, validationResult } = require('express-validator');
// const moment = require("moment");
const { where, Op } = require("sequelize");
const models = require("../../models");
const { cloudfunctions } = require("googleapis/build/src/apis/cloudfunctions");
const Service = models.service;
// const serviceDetail = models.serviceDetail;
const serviceImage = models.serviceImage;
const ServiceFaqs = models.serviceFaq;
const SubServices = models.subServices;
const SubServicePrice = models.subServicePrice;
const Category = models.category;
const MainServiceSettings = models.serviceSettings;
const Banner = models.banner;
const Cms = models.cms;
const WhyNiccs = models.why_us;
const Page = models.page;

module.exports = {
  serviceGet: async function (req, res) {
    try {
      const services = await Service.findAll({
        where: { status: 1 },
        attributes: ["id", "title", "slug"],
      });
      return res.status(200).json({
        status: true,
        data: services,
        message: "Data fetched successfully.",
      });
    } catch (error) {
      console.log(error);
    }
  },
  getSubService: async function (req, res) {
    try {
      const { id } = req.params;

      const SubServicePrices = await SubServicePrice.findAll({
        attributes: ["id", "title", "price", "gender"],
        where: { price: { [Op.gt]: 0 } },
        include: [
          {
            model: SubServices,
            attributes: ["id", "slug", "title", "description", "order_no", "type"],
            order: [["order_no", "ASC"]],
            where: {
              status: 1,
              service_id: id,
            },
          },
        ],
      });

      return res.status(200).json({
        status: true,
        data: SubServicePrices,
        message: "Data fetched successfully.",
      });
    } catch (error) {
      console.log(error);
    }
  },
  getServiceList: async function (req, res) {
    try {
      const slug = 'services';
      const services = await Service.findAll({});


      const banners = await Banner.findAll({
        where: { status: 1, page_id: 3 },
        attributes: ['id', 'page_id', 'title', 'image', 'altTagImage', 'image_mob', 'altTagImageMob', 'description', 'status', 'order_no'],
        order: [['order_no', 'ASC']]
      });

      const cmsList = await Cms.findAll({
        where: { status: 1, slug: slug },
        attributes: ['id', 'title', 'shadow_title', 'description', 'image', 'alt_tag', 'slug']
      });
      const serviceFaqs = await ServiceFaqs.findAll({
        where: { show_in_main: 1 },
        order: [['order_no', 'ASC']]
      });
      const faqTitle = await MainServiceSettings.findOne({
        where: { serviceTitleId: 6 }
      });
      const serviceTitle = await MainServiceSettings.findOne({
        where: { serviceTitleId: 5 }
      });
      // let arrayCms = {};
      for (let q = 0; q < cmsList.length; q++) {
        const itemBanner = cmsList[q];
        arrayCms = {
          id: itemBanner.id,
          title: itemBanner.title,
          shadow_title: itemBanner.shadow_title,
          image: `${siteUrl}/uploads/cms/${itemBanner.image}`,
          alt_tag: itemBanner.alt_tag,
          slug: itemBanner.slug,
          description: itemBanner.description,
        }
      }
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
        }
      }

      let serviceList = [];
      for (let i = 0; i < services.length; i++) {
        const item = services[i];
        item["image"] = `${siteUrl}/uploads/service/${item.image}`;
        item["logo"] = `${siteUrl}/uploads/service/${item.logo}`;
        item["banner"] = `${siteUrl}/uploads/service/banners/${item.banner}`;
        item["banner_mob"] = `${siteUrl}/uploads/service/banners/${item.banner_mob}`;
        serviceList.push(item);
      }

      const servicesDict = {
        title: serviceTitle['title'],
        shadow_title: serviceTitle['shadow_title'],
        services: serviceList,
      };

      const faqDict = {
        title: faqTitle['title'],
        shadowTitle: faqTitle['shadow_title'],
        faqs: serviceFaqs,
      }

      return res.status(200).json({
        status: true,
        message: "Data fetched successfully.",
        banner: arrayBanners,
        // cms:arrayCms,
        faqs: faqDict,
        services: servicesDict,
      });
    } catch (error) {
      console.log(error);
      console.log("Error While implementing Service");
    }
  },
  servicePost: async function (req, res) {
    try {
      const { slug } = req.query;

      const page = await Page.findOne({
        where: { slug: slug },
        attributes: ["id"],
      });

      const banners = await Banner.findOne({
        where: { status: 1, page_id: page.id },
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

      const reqGender = req.body.gender || req.query.gender;
      let subServiceWhere = { status: 1 };
      if (reqGender && reqGender !== "Both") {
        subServiceWhere.gender = { [Op.in]: [reqGender, "Both"] };
      }

      const subService = await SubServices.findAll({
        attributes: ["id", "slug", "title", "description", "order_no", "type", "gender"],
        where: subServiceWhere,
        order: [["order_no", "ASC"]],
        include: [
          {
            model: Service,
            attributes: ["title", "description"],
            where: { slug: slug, status: 1 },
          },
          {
            model: SubServicePrice,
            attributes: ["subservice_id", "title", "price", "gender"],
            where: {
              price: { [Op.ne]: "" },
              ...(reqGender && reqGender !== "Both" ? {
                [Op.or]: [
                  { gender: reqGender },
                  { gender: null },
                  { gender: "Both" }
                ]
              } : {})
            },
            separate: true,
            order: [["title", "ASC"]],
          },
        ],
      });

      return res.status(200).json({
        status: true,
        data: {
          services: subService,
          banner: bannerData
        },
        title: subService[0]?.service?.title ?? null,
        shadow_title: 'Service',
        message: "Data fetched successfully.",
      });
    } catch (error) {
      console.log(error);
      console.log("Error While implementing Service");
      return res.status(200).json({
        status: false,
        message: "Something went wrong, please try again.",
        error,
      });
    }
  },
  details: async function (req, res) {
    try {
      const { slug } = req.body;

      return res.status(200).json({
        status: true,
        message: "Data fetched successfully.",
        banner: arrayBanners,
        // cms:arrayCms,
        faqs: faqDict,
        services: servicesDict,
      });
    } catch (error) {
      console.log(error);
      console.log("Error While implementing Service");
    }
  },

  details: async function (req, res) {
    try {
      const { slug } = req.body;

      const service = await Service.findOne({
        where: { slug: slug },
        attributes: [
          "id",
          "title",
          "short_description",
          "heading",
          "description",
          "image",
          "banner",
          "sub_services_description",
          "details_heading",
          "meta_title",
          "meta_description",
          "meta_keywords",
          "slug",
          "banner_mob",
        ],
      });

      const serviceFaqs = await ServiceFaqs.findAll({
        where: { service_id: service.id },
        order: [["order_no", "ASC"]],
      });

      const subServices = await SubServices.findAll({
        where: { service_id: service.id },
        order: [["order_no", "ASC"]],
      });

      const whyNiccs = await WhyNiccs.findAll({ where: { status: 1 } });
      // console.log(whyNiccs);
      let whyNiccsCorrectedData = [];
      for (let i = 0; i < whyNiccs.length; i++) {
        const item = whyNiccs[i];
        const object = {
          id: item.id,
          title: item.title,
          image: `${siteUrl}/uploads/why_us/${item.image}`,
          alt_tag: item.alt_tag,
          description: item.description,
          order_no: item.order_no,
        };
        whyNiccsCorrectedData.push(object);
      }

      const servicesFromDB = await Service.findAll({
        where: { status: 1 },
        attributes: [
          "id",
          "title",
          "heading",
          "short_description",
          "logo",
          "altTagLogo",
          "slug",
        ],
      });
      let serviceList = [];
      for (let i = 0; i < servicesFromDB.length; i++) {
        const item = servicesFromDB[i];
        item["image"] = `${siteUrl}/uploads/cms/${item.image}`;
        item["logo"] = `${siteUrl}/uploads/service/${item.logo}`;
        item["banner"] = `${siteUrl}/uploads/service/banners/${item.banner}`;
        item[
          "banner_mob"
        ] = `${siteUrl}/uploads/service/banners/${item.banner_mob}`;
        // const object = {
        // 	id: 	item.id,
        // 	title: 	item.title,
        // 	heading: item.heading,
        // 	short_description: 	item.short_description,
        // 	image: 	`${siteUrl}/uploads/service/${item.logo}`,
        // 	altTag: item.altTagLogo,
        // 	slug:   item.slug
        // }
        serviceList.push(item);
      }

      const subServicesTitle = await MainServiceSettings.findOne({
        where: { serviceTitleId: 1 },
      });
      const whyUsTitle = await MainServiceSettings.findOne({
        where: { serviceTitleId: 2 },
      });
      const allServicesTitle = await MainServiceSettings.findOne({
        where: { serviceTitleId: 3 },
      });
      const faqTitle = await MainServiceSettings.findOne({
        where: { serviceTitleId: 4 },
      });

      // const response = {
      //     id: 	service.id,
      //     title: 	service.title,
      //     short_description: 	service.short_description,
      //     shadowTitle: 	service.heading,
      //     description: 	service.description,
      //     image: 	`${siteUrl}/uploads/service/${service.image}`,
      //     banner: 	`${siteUrl}/uploads/service/banners/${service.banner}`,
      //     mob_banner: 	`${siteUrl}/uploads/service/banners/${service.banner_mob}`,
      //     details_heading: 	service.details_heading,
      // 	   sub_services_description:service.sub_services_description,
      //     meta_title: 	service.meta_title,
      //     meta_description: 	service.meta_description,
      //     meta_keywords: 	service.meta_keywords,
      //     slug:   service.slug,
      // }

      let subServicesList = [];
      if (subServices && subServices.length > 0) {
        for (let i = 0; i < subServices.length; i++) {
          const item = subServices[i];
          subServicesList.push(item.title);
        }
      }

      let serviceFaqsList = [];
      if (serviceFaqs && serviceFaqs.length > 0) {
        for (let i = 0; i < serviceFaqs.length; i++) {
          const item = serviceFaqs[i];
          serviceFaqsList.push(item);
        }
      }

      const serviceImages = await serviceImage.findAll({
        where: { service_id: service.id },
        attributes: ["image"],
        order: [["order_no", "ASC"]],
      });

      let arrayImage = [];
      if (serviceImages && serviceImages.length > 0) {
        for (let i = 0; i < serviceImages.length; i++) {
          const itemImg = serviceImages[i];
          const detailImage =
            siteUrl + "/uploads/service/banners/" + itemImg.image;
          arrayImage.push(detailImage);
        }
      }

      const subServicesDict = {
        title: subServicesTitle["title"],
        shadowTitle: subServicesTitle["shadow_title"],
        services: subServicesList,
        description: service.sub_services_description,
      };
      const faqDict = {
        title: faqTitle["title"],
        shadowTitle: faqTitle["shadow_title"],
        faqs: serviceFaqsList,
      };
      const whyUsDict = {
        title: whyUsTitle["title"],
        shadowTitle: whyUsTitle["shadow_title"],
        whyNiccs: whyNiccsCorrectedData,
      };
      const bannerDict = {
        banner: `${siteUrl}/uploads/service/banners/${service.banner}`,
        mob_banner: `${siteUrl}/uploads/service/banners/${service.banner_mob}`,
        title: service.title,
        short_description: service.short_description,
      };

      const otherServicesDict = {
        title: allServicesTitle["title"],
        shadowTitle: allServicesTitle["shadow_title"],
        services: serviceList,
      };

      // service["image"]=`${siteUrl}/uploads/cms/${service.image}`;
      // service["logo"]=`${siteUrl}/uploads/service/${service.logo}`;
      // service["banner"]=`${siteUrl}/uploads/service/banners/${service.banner}`;
      // service["banner_mob"]=`${siteUrl}/uploads/service/banners/${service.banner_mob}`;
      // service["shadowTitle"]=service.heading;

      // let arrayCms = {};
      // for(let q = 0; q < cmsList.length; q++)
      // {
      // 	const itemBanner = cmsList[q];
      // 	arrayCms = {
      // 		id: itemBanner.id,
      // 		title: itemBanner.title,
      // 		shadow_title: itemBanner.shadow_title,
      // 		image: `${siteUrl}/uploads/cms/${itemBanner.image}`,
      // 		alt_tag: itemBanner.alt_tag,
      // 		slug: itemBanner.slug,
      // 		description: itemBanner.description,
      // 	}
      // }
      let arrayCms = {};
      for (let q = 0; q < cmsList.length; q++) {
        const itemBanner = cmsList[q];
        arrayCms = {
          id: itemBanner.id,
          title: itemBanner.title,
          shadow_title: itemBanner.shadow_title,
          image: `${siteUrl}/uploads/banners/${banner.image}`,
          banner_heading: itemBanner.banner_heading,
          altTagImage: itemBanner.alt_tag,
          mob_image: `${siteUrl}/uploads/banners/${banner.image_mob}`,
          altTagImageMob: itemBanner.alt_tag,
          slug: itemBanner.slug,
          description: itemBanner.description,
        };
      }
      // let arrayBanners = {};
      // for(let j = 0; j < banners.length; j++)
      // {
      // 	const itemBanner = banners[j];
      // 	arrayBanners = {
      // 		id: itemBanner.id,
      // 		title: itemBanner.title,
      // 		image: `${siteUrl}/uploads/banners/${itemBanner.image}`,
      // 		altTagImage: itemBanner.altTagImage,
      // 		mob_image: 	`${siteUrl}/uploads/banners/${itemBanner.image_mob}`,
      // 		altTagImageMob: itemBanner.altTagImageMob,
      // 		description: itemBanner.description,
      // 	}
      // }

      return res.status(200).json({
        status: true,
        message: "Data fetched successfully.",
        banner: arrayCms,
        faqs: {
          title: arrayCms["title"],
          shadowTitle: arrayCms["shadow_title"],
          faqs: serviceFaqs,
        },
        // cms:arrayCms,
      });
    } catch (error) {
      console.log(error);
      console.log("Error While implementing Faqs");
    }
  },
  get_categories: async function (req, res) {
    try {
      const category = await Category.findAll({});
      return res.status(200).json({
        status: true,
        data: category,
        message: "Data fetched successfully.",
      });
    } catch (error) {
      console.log(error);
    }
  },
};
