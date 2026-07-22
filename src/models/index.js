const dbSequelize = require("../configs/sequelize.config");
const Sequelize = require("sequelize");

const sequelize = dbSequelize;
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Models
db.admin = require("./admin")(sequelize, Sequelize);
db.setting = require("./setting")(sequelize, Sequelize);
db.homePageContents = require("./homePageContents")(sequelize, Sequelize);
db.emailTemplate = require("./emailTemplate")(sequelize, Sequelize);
db.page = require("./page")(sequelize, Sequelize);
db.forms = require("./forms")(sequelize, Sequelize);
db.banner = require("./banner")(sequelize, Sequelize);
db.cms = require("./cms")(sequelize, Sequelize);
db.service = require("./service")(sequelize, Sequelize);
db.serviceFaq = require("./serviceFaq")(sequelize, Sequelize);
db.serviceSettings = require("./serviceSettings")(sequelize, Sequelize);
db.servicePages = require("./servicePages")(sequelize, Sequelize);
db.subServices = require("./subServices")(sequelize, Sequelize);
db.serviceImage = require("./serviceImage")(sequelize, Sequelize);
db.testimonials = require("./testimonials")(sequelize, Sequelize);
db.metaContents = require("./metaContents")(sequelize, Sequelize);
db.country = require("./country")(sequelize, Sequelize);
db.about = require("./about")(sequelize, Sequelize);
db.menu = require("./menu")(sequelize, Sequelize);
db.pageContent = require("./pageContent")(sequelize, Sequelize);
db.formContent = require("./formContent")(sequelize, Sequelize);
db.subServicePrice = require("./subServicePrice")(sequelize, Sequelize);
db.appointmentForm = require("./appointmentForm")(sequelize, Sequelize);
db.timeSlot = require("./timeslot")(sequelize, Sequelize);
db.category = require("./category")(sequelize, Sequelize);
db.giftVouchers = require("./giftVouchers")(sequelize, Sequelize);
db.formServices = require("./formServices")(sequelize, Sequelize);
db.timeSlotValues = require("./timeSlotValues")(sequelize, Sequelize);
db.faq = require("./faq")(sequelize, Sequelize);
db.therapist = require("./therapist")(sequelize, Sequelize);

db.banner.belongsTo(db.page, { foreignKey: 'page_id' });
// db.cms.belongsTo(db.page, {foreignKey: 'page_id'});
// db.metaContents.belongsTo(db.page, {foreignKey: 'page_id'});
db.serviceFaq.belongsTo(db.service, { foreignKey: 'service_id' });
db.serviceImage.belongsTo(db.service, { foreignKey: 'service_id' });
db.serviceSettings.belongsTo(db.servicePages, { foreignKey: 'serviceTitleId' });
db.appointmentForm.hasMany(db.formServices, { foreignKey: 'form_id' });
db.formServices.belongsTo(db.service, { foreignKey: 'service_id' });
db.formServices.belongsTo(db.subServices, { foreignKey: 'subservice_id' });
db.category.hasMany(db.subServicePrice, { foreignKey: 'category_id' });

db.subServicePrice.belongsTo(db.subServices, { foreignKey: 'subservice_id' });
db.subServices.belongsTo(db.service, { foreignKey: 'service_id' });
db.subServices.hasMany(db.subServicePrice, { foreignKey: 'subservice_id' });

db.timeSlot.hasMany(db.timeSlotValues, { foreignKey: 'time_slot_id' });

db.service.hasMany(db.subServices, { foreignKey: 'service_id' });
db.subServices.belongsTo(db.service, { foreignKey: 'service_id' });

db.pageContent.belongsTo(db.page, { foreignKey: 'page_id' });
db.formContent.belongsTo(db.forms, { foreignKey: 'page_id' });

module.exports = db;