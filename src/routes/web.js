const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const homeController = require('../controllers/home.controller');
const settingController = require('../controllers/setting.controller');
const homePageContentsController = require('../controllers/homePageContents.controller');
const emailTemplateController = require('../controllers/emailTemplate.controller');
const bannerController = require('../controllers/banner.controller');
const cmsController = require('../controllers/cms.controller');
const subServicesPageController = require('../controllers/subServicesPage.controller');
const serviceController = require('../controllers/service.controller');
const subserviceController = require('../controllers/subService.controller')
const aboutController = require('../controllers/about.controller');
const menuController = require('../controllers/menu.controller');
const pageContentController = require('../controllers/pageContent.controller');
const formContentController = require('../controllers/formContent.controller');
const giftVoucherController = require('../controllers/giftVoucher.controller');
const formEnquiryController = require('../controllers/formEnquiry.controller');
const timeSlotController = require('../controllers/timeSlot.controller');
const faqController = require('../controllers/faq.controller');

const auth = require("../middlewares/auth");
const testimonialsController = require('../controllers/testimonials.controller');
const metaContentsController = require('../controllers/metaContents.controller');
const categoryController = require('../controllers/category.controller');

router.get('/', authController.login);
router.post('/authenticate', authController.authenticate);
router.get('/logout', authController.logout);

router.get('/dashboard', auth, homeController.dashboard);
router.get('/profile', auth, homeController.profile);
router.post('/profile-post', auth, homeController.profilePost);
router.get('/password', auth, homeController.password);
router.post('/change-password', auth, homeController.changePassword);

router.get('/general_setting', auth, settingController.general);
router.post('/general_setting_post', auth, settingController.generalPost);

router.get('/home_page_contents', auth, homePageContentsController.homePageContents);
router.post('/home_page_contents_post', auth, homePageContentsController.homePageContentsPost);

router.get('/home_massage', auth, homePageContentsController.homeMassage);
router.post('/home_massage_post', auth, homePageContentsController.homeMassagePost);

router.get('/why_choose', auth, homePageContentsController.whyChoose);
router.post('/why_choose_post', auth, homePageContentsController.whyChoosePost);

router.get('/services_offered', auth, homePageContentsController.servicesOffered);
router.post('/services_offered_post', auth, homePageContentsController.servicesOfferedPost);

router.get('/massage_types', auth, homePageContentsController.massageTypes);
router.post('/massage_types_post', auth, homePageContentsController.massageTypesPost);

router.get('/health_benefits', auth, homePageContentsController.healthBenefits);
router.post('/health_benefits_post', auth, homePageContentsController.healthBenefitsPost);

router.get('/safety_privacy', auth, homePageContentsController.safetyPrivacy);
router.post('/safety_privacy_post', auth, homePageContentsController.safetyPrivacyPost);

router.get('/booking_steps', auth, homePageContentsController.bookingSteps);
router.post('/booking_steps_post', auth, homePageContentsController.bookingStepsPost);

router.get('/massage_cost', auth, homePageContentsController.massageCost);
router.post('/massage_cost_post', auth, homePageContentsController.massageCostPost);

router.get('/areas_covered', auth, homePageContentsController.areasCovered);
router.post('/areas_covered_post', auth, homePageContentsController.areasCoveredPost);

router.get('/massage_legal', auth, homePageContentsController.massageLegal);
router.post('/massage_legal_post', auth, homePageContentsController.massageLegalPost);

router.get('/get_started', auth, homePageContentsController.getStarted);
router.post('/get_started_post', auth, homePageContentsController.getStartedPost);

router.get('/smtp_setting', auth, settingController.smtp);
router.post('/smtp_setting_post', auth, settingController.smtpPost);

router.get('/meta_contents', auth, metaContentsController.index);
router.post('/meta_contents_post', auth, metaContentsController.store);

router.get('/email_template', auth, emailTemplateController.index);
router.post('/email_template_post', auth, emailTemplateController.store);

router.get('/banner', auth, bannerController.index);
router.post('/banner_post', auth, bannerController.store);

router.get('/cms', auth, cmsController.index);
router.post('/cms_post', auth, cmsController.store);

router.get('/sub_services_page_settings', auth, subServicesPageController.index);
router.post('/sub_services_page_settings_post', auth, subServicesPageController.store);

router.get('/service', auth, serviceController.index);
router.post('/service_post', auth, serviceController.store);

router.get('/sub_service', auth, subserviceController.index);
router.post('/sub_service_post', auth, subserviceController.store);
router.post('/sub_service/get_categories', auth, subserviceController.getCategory);

router.get('/testimonials', auth, testimonialsController.index);
router.post('/testimonial_post', auth, testimonialsController.store);

router.get('/about', auth, aboutController.index);
router.post('/about_post', auth, aboutController.store);

router.get('/menu', auth, menuController.index);
router.post('/menu_post', auth, menuController.store);

router.get('/page_content', auth, pageContentController.index);
router.post('/page_content_post', auth, pageContentController.store);

router.get('/form_content', auth, formContentController.index);
router.post('/form_content_post', auth, formContentController.store);

router.get('/faq', auth, faqController.index);
router.post('/faq_post', auth, faqController.store);

router.get('/clear-home-cache', homeController.clearHomeCache);

router.get('/category', auth, categoryController.index);
router.post('/category_post', auth, categoryController.store);
router.get('/gift_voucher', auth, giftVoucherController.index);
router.post('/gift_voucher_post', auth, giftVoucherController.store);
router.get('/time_slot', auth, timeSlotController.index);
router.post('/time_slot_post', auth, timeSlotController.store);

router.get('/form_enquiry', auth, formEnquiryController.index);




module.exports = router;