const express = require('express');
const router = express.Router();

const homeController = require('../controllers/api/home.controller');
const contactController = require('../controllers/api/contact.controller');
const testimonialsController = require('../controllers/api/testimonials.controller');
const serviceController = require('../controllers/api/service.controller');
const { files } = require('../middlewares/upload');

// Common | Header and Footer
router.get('/get_menu', homeController.getMenu);

// Common | Sections
// router.post('/cms', homeController.cms); // CMS
router.post('/cms_content', homeController.cmsContent); // CMS Content
router.post('/get_banner', homeController.banner); // Banner
router.post('/meta_contents', homeController.metaContents); // Meta Contents
router.get('/sitemap', homeController.sitemap); // Sitemap

router.post('/submit_contact', contactController.contact);
router.get('/contact_form_content', contactController.formContent);  // Submit Form

// var multer = require('multer');
router.get('/get_a_quote_content', contactController.getAquoteContents);// Common | Testimonials
router.get('/get_testimonials', testimonialsController.testimonials);

router.get('/site_info', homeController.info);
router.get('/get_faq', homeController.faq);
router.get('/home_content', homeController.home);
router.get('/get_home_page_sections', homeController.getHomePageSections);
router.get('/get_female_massage_sections', homeController.getFemaleMassageSections);

// About Page
router.post('/about_content', homeController.aboutUsPost);
router.get('/get_about_page_sections', homeController.getAboutPageSections);
router.get('/get_our_teams', homeController.getOurTeams);
router.get('/get_therapists', homeController.therapists);

// Service Page
router.post('/get_all_services', serviceController.getServiceList);
router.get('/get_service_detail', serviceController.servicePost);
router.get('/service_list', serviceController.serviceGet);
router.get('/get_subservices/:id', serviceController.getSubService);
router.get('/get_categories', serviceController.get_categories);

router.get('/get_timeslot', homeController.get_timeslot);

router.post('/appointment_form', contactController.appointment_form);

router.get('/gift_vouchers', homeController.gift_voucher);

module.exports = router;