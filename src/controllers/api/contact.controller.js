const { body, validationResult } = require("express-validator");
const models = require("../../models");
const GetInTouch = models.getInTouch;
const formContent = models.formContent;
const Banner = models.banner;
const Cms = models.cms;
const Country = models.country;
const Service = models.service;
const Timeslot = models.timeSlot;
const ourPresence = models.our_presence;
const formAppointment = models.appointmentForm;
const FormServices = models.formServices;
const SubServicePrice = models.subServicePrice;
const SubServices = models.subServices;
const TimeSlotValues = models.timeSlotValues;

const {
  adminEmail,
  adminEmails,
  sendEmail,
  sendMultipleEmail,
} = require("../../services/email.service");
const googleSheetContoller = require("./googleSheet.contoller");
const { verifyCaptcha } = require("../../services/recaptcha.service");

module.exports = {
  contact: async function (req, res) {
    // console.log(await adminEmails(),'emails');

    try {
      await body("name", "Name is required.").notEmpty().run(req);
      await body("phone_no", "Phone number is required.").notEmpty().run(req);
      await body("email", "Email is required.").notEmpty().run(req);
      await body("service", "Service is required.").notEmpty().run(req);
      await body("address", "Address is required.").notEmpty().run(req);
      await body("message", "Message is required.").notEmpty().run(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(422)
          .json({ status: false, message: errors.array()[0].msg });
      }
      const { name, email, phone_no, address, message, service } = req.body;
      // const country = await Country.findOne({where: {code: location}, attributes: ['name']});
      // console.log(country,'country');
      const isInt = /^\d+$/;
      const serv = await Service.findOne({
        where: { status: 1, slug: service },
        attributes: ["id", "title"],
      });
      const service_id = isInt.test(service) ? service : serv?.id;

      const object = {
        name: name,
        email: email,
        phone_no: phone_no,
        service_id: service_id,
        // location:       location,
        address: address,
        message: message,
        timestamp: Math.floor(new Date().getTime() / 1000),
        status: 1,
      };
      const record = await GetInTouch.create(object);
      if (record) {
        const servq = await Service.findOne({
          where: { id: service_id },
          order: [["title", "ASC"]],
          attributes: ["id", "title"],
        });
        const object = {
          name: name,
          email: email,
          phone_no: phone_no,
          location: address,
          service: servq?.title,
          address: address,
          message: message,
          timestamp: Math.floor(new Date().getTime() / 1000),
          status: 1,
        };

        await sendMultipleEmail(
          await adminEmails(),
          "CONTACT_ENQ_ADMIN",
          null,
          object
        );

        await googleSheetContoller.addToSheet("Contact!A2", [
          object.service,
          object.name,
          object.email,
          object.phone_no,
          object.message,
          object.address,
        ]);

        // await sendEmail('digital@prowebtechnos.com', "CONTACT_ENQ_ADMIN", null, object);
        // await sendEmail('deven1606@gmail.com', "CONTACT_ENQ_ADMIN", null, object);
      }

      return res.status(200).json({
        status: true,
        message: "Contact enquiry submitted successfully.",
        data: null,
      });
    } catch (error) {
      console.log("Error while implementing contact");
      console.log(error);
    }
  },

  getAquoteContents: async function (req, res) {
    try {
      const response = await formContent.findOne({
        where: { page_id: 2 },
        attributes: [
          "id",
          "title",
          "shadow_title",
          "name_label",
          "phone_label",
          "email_label",
          "date_label",
          "location_label",
          "slot_label",
          "service_label",
          "subservice_label",
          "service_section_label",
          "full_address_label",
        ],
      });

      return res.status(200).json({
        status: true,
        message: "Data fetched successfully.",
        data: response,
      });
    } catch (error) {
      // console.log(error);
      console.log("Error While implementing Get A Quote");
    }
  },

  // // Depricated
  // contactPage: async function (req, res) {
  // 	try {
  //         const response = await formContent.findOne({where: {page_id: 1}, attributes: ['id','title','shadow_title','name_label','phone_label','email_label','location_label','message_label','image','alt_tag']});

  //         const banners = await Banner.findAll({
  // 			where: {status: 1, page_id: 5},
  // 			attributes: ['id', 'page_id', 'title', 'image', 'altTagImage'],
  // 			order: [ ['order_no', 'ASC'] ]
  // 		});

  // 		let arrayBanners = {};
  // 		for(let j = 0; j < banners.length; j++)
  // 		{
  // 			const itemBanner = banners[j];
  // 			arrayBanners = {
  // 				id: itemBanner.id,
  // 				bannerTitle: itemBanner.title,
  // 				bannerImage: `${siteUrl}/uploads/banners/${itemBanner.image}`,
  // 				bannerAltTag: itemBanner.altTagImage,
  // 			}
  // 		}

  //         const cms = await Cms.findAll({
  // 			where: {status: 1, page_id: 5},
  // 			attributes: ['id', 'title', 'description']
  // 		});

  // 		let arrayCms = {};
  // 		for(let j = 0; j < cms.length; j++)
  // 		{
  // 			const itemBanner = cms[j];
  // 			arrayCms = {
  // 				id: itemBanner.id,
  // 				subTitle: itemBanner.title,
  // 				description: itemBanner.description,
  // 			}
  // 		}

  //         return res.status(200).json({
  // 			status: true,
  // 			message: "Data fetched successfully.",
  //             data:{
  // 				banner: arrayBanners,
  //                 data:{
  //                     cmsTitle: arrayCms["subTitle"],
  //                     description: arrayCms["description"],
  //                     title: response["title"],
  //                     shadow_title: response["shadow_title"],
  //                     name_label: response["name_label"],
  //                     phone_label: response["phone_label"],
  //                     email_label: response["email_label"],
  //                     location_label: response["location_label"],
  //                     message_label: response["message_label"],
  //                     image: response["image"],
  //                     alt_tag: response["alt_tag"]
  //                 }
  // 		    }
  // 		});
  // 	} catch (error) {
  //         console.log("Error While implementing contact");
  // 	}
  // },

  contactPagePost: async function (req, res) {
    try {
      const { slug } = req.body;
      const response = await formContent.findOne({
        where: { page_id: 1 },
        attributes: [
          "id",
          "title",
          "shadow_title",
          "name_label",
          "phone_label",
          "email_label",
          "location_label",
          "message_label",
          "alt_tag",
        ],
      });

      const banners = await Banner.findAll({
        // const banners = await Banner.findOne({
        where: { status: 1, page_id: 5 },
        order: [["order_no", "ASC"]],
      });
      const services = await Service.findAll({
        where: { status: 1 },
        order: [["title", "ASC"]],
        attributes: ["id", "title"],
      });

      const our_presence = await ourPresence.findAll({
        where: { status: 1 },
        order: [["order_no", "ASC"]],
        attributes: {
          exclude: ["createdAt", "updatedAt", "order_no", "status"],
        },
      });
      let arrayBanners = {};
      for (let j = 0; j < banners.length; j++) {
        const itemBanner = banners[j];
        arrayBanners = {
          id: itemBanner.id,
          bannerTitle: itemBanner.title,
          bannerImage: `${siteUrl}/uploads/banners/${itemBanner.image}`,
          bannerAltTag: itemBanner.altTagImage,
          image_mob: `${siteUrl}/uploads/banners/${itemBanner.image_mob}`,
          alt_tag_mob: itemBanner.altTagImage,
        };
      }

      const cms = await Cms.findAll({
        where: { status: 1, slug: slug },
        // attributes: ['id', 'title', 'description']
      });

      let arrayCms = {};
      for (let j = 0; j < cms.length; j++) {
        const itemBanner = cms[j];
        arrayCms = {
          id: itemBanner.id,
          subTitle: itemBanner.title,
          description: itemBanner.description,
        };
      }

      return res.status(200).json({
        status: true,
        message: "Data fetched successfully.",
        data: {
          banner: arrayBanners,
          services: services,
          our_presence: our_presence,
          data: {
            cmsTitle: arrayCms["subTitle"],
            description: arrayCms["description"],
            title: response["title"],
            shadow_title: response["shadow_title"],
            name_label: response["name_label"],
            phone_label: response["phone_label"],
            email_label: response["email_label"],
            location_label: response["location_label"],
            message_label: response["message_label"],
            image: response["image"],
            alt_tag: response["alt_tag"],
          },
        },
      });
    } catch (error) {
      console.log(error);
      console.log("Error While implementing contact");
    }
  },

  formContent: async function (req, res) {
    try {
      const response = await formContent.findOne({
        where: { page_id: 1 },
        attributes: [
          "id",
          "title",
          "shadow_title",
          "name_label",
          "phone_label",
          "email_label",
          "location_label",
          "message_label",
          "alt_tag",
        ],
      });

      return res.status(200).json({
        status: true,
        message: "Data fetched successfully.",
        title: response["title"],
        shadow_title: response["shadow_title"],
        image: `${siteUrl}/uploads/cms/${response["image"]}`,
        data: response,
      });
    } catch (error) {
      // console.log(error);
      console.log("Error While implementing contact");
    }
  },

  appointment_form: async function (req, res) {
    try {
      const {
        name,
        email,
        phone_no,
        gender,
        services,
        location,
        address,
        date,
        slot,
      } = req.body;

      await body('name', 'Name is required.').notEmpty().run(req);
      await body('email', 'Email is required.').notEmpty().isEmail().withMessage('Please enter valid email.').run(req);
      await body('gender', 'Gender is required.').notEmpty().run(req);
      // await body('services', 'Service is required.').notEmpty().run(req);
      await body('phone_no', 'Phone number is required.').notEmpty().isNumeric().withMessage('Please enter valid phone number.').run(req);
      await body('location', 'Location is required.').notEmpty().run(req);
      await body('address', 'Address is required.').notEmpty().run(req);
      await body('date', 'Date is required.').notEmpty().run(req);
      await body('slot', 'Slot is required.').notEmpty().run(req);
      await body("services", "Service is required.")
        .notEmpty()
        .isArray({ min: 1 }).withMessage("Service is required.")
        .custom((services) => {
          for (let i = 0; i < services.length; i++) {
            const serviceObj = services[i];
            if (!serviceObj.service || !serviceObj.sub_service) {
              throw new Error("Service and Subservice are required.");
            }
          }
          return true;
        })
        .run(req);


      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ status: false, message: errors.array()[0].msg });
      }

      const captchaToken =
        req.body["g-recaptcha-response"] ||
        req.body.captcha_token ||
        req.body.recaptcha_token ||
        req.body.captchaToken ||
        req.body.recaptcha ||
        req.body.captcha ||
        req.headers["x-recaptcha-token"] ||
        req.headers["g-recaptcha-response"];

      if (!captchaToken) {
        return res.status(422).json({
          status: false,
          message: "Captcha verification failed. Captcha token is required.",
        });
      }

      const captchaResult = await verifyCaptcha(captchaToken, req.ip);
      if (!captchaResult.success) {
        return res.status(422).json({
          status: false,
          message: captchaResult.message || "Captcha verification failed.",
        });
      }

      const row = await TimeSlotValues.findOne({ where: { id: slot }, attributes: ['start_time', 'end_time'] });
      const slotvalue = row?.start_time + "-" + row.end_time;
      const formdata = {
        name: name,
        email_address: email,
        phone_number: phone_no,
        gender: gender,
        location: location,
        address: address,
        date: date,
        slot: slotvalue,
      };


      const formRecord = await formAppointment.create(formdata);
      id = formRecord.id ?? null;


      let subservicePriceHTML = `
    <table style="
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
        border: 1px solid #ddd;
        font-family: Arial, sans-serif;">
        <thead>
            <tr style="background-color: #f2f2f2; text-align: left;">
            <th style="padding: 10px; border: 1px solid #ddd;">Service</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Category</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Price</th>
            </tr>
        </thead>
     <tbody>`;

      let amount = 0

      for (let service of services) {
        const subServicePrice = await SubServicePrice.findByPk(
          service.sub_service
        );

        if (!subServicePrice) {
          return res.status(400).json({
            status: false,
            message: `Selected sub-service price ID ${service.sub_service} is invalid or not found.`,
          });
        }

        const subService = await SubServices.findByPk(
          subServicePrice.subservice_id
        );
        const serviceDetail = await Service.findByPk(service.service);

        if (!subService) {
          return res.status(400).json({
            status: false,
            message: `Sub-service not found for price ID ${service.sub_service}.`,
          });
        }

        if (!serviceDetail) {
          return res.status(400).json({
            status: false,
            message: `Service with ID ${service.service} not found.`,
          });
        }

        amount += parseFloat(subServicePrice.price || 0);

        await FormServices.create({
          form_id: id,
          service_id: service.service,
          subservice_id: subService.id,
          subservice_price_id: service.sub_service,
          service_title: serviceDetail.title,
          sub_service_title: subService.title,
          sub_service_price_title: subServicePrice.title,
          sub_service_price: subServicePrice.price,
        });

        subservicePriceHTML += `<tr>
                  <td style="padding: 10px; border: 1px solid #ddd;">${serviceDetail.title}</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${subService.title}</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${subServicePrice.price} AED</td>
              </tr>`;
      }
      subservicePriceHTML += `</tbody></table>`;
      const object = {
        name,
        email,
        phone_no,
        gender,
        location,
        services,
        total_amount: amount + " AED",
        address,
        date,
        time: slot,
        service: subservicePriceHTML
      };

      await formAppointment.update({ amount }, { where: { id: id } });
      await sendEmail(email, "CONTACT_ENQ_USER", null, object);
      await sendEmail(email, "CONTACT_ENQ_ADMIN", null, object);
      return res.status(200).json({
        status: true,
        message: "Form Submitted successfully.",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: false,
        message: "Internal server error.",
      });
    }
  },
};
