process.env.NODE_ENV = 'production';
require('dotenv').config({ path: './.env.production' });
global.siteName = process.env.SITE_NAME || 'Beaudeluxe';
global.siteUrl = process.env.SITE_URL || 'http://localhost:4000';

const db = require('./src/models');
const homeApiController = require('./src/controllers/api/home.controller');
const cache = require('memory-cache');

async function testFemaleMassageFaqsApi() {
  try {
    await db.sequelize.authenticate();
    cache.clear();

    let resData = null;
    const reqMock = { query: {} };
    const resMock = {
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        resData = data;
        return this;
      }
    };

    await homeApiController.getFemaleMassageSections(reqMock, resMock);

    console.log('Status Code:', resMock.statusCode);
    console.log('Response Status:', resData.status);

    if (resData && resData.data) {
      console.log('\nKeys in data object:', Object.keys(resData.data));
      if (resData.data.faqs) {
        console.log(`\nFound ${resData.data.faqs.length} Female Massage FAQs:`);
        console.log(resData.data.faqs);
      } else {
        console.error('ERROR: faqs missing from data object!');
      }
    }
  } catch (err) {
    console.error('Error testing API:', err);
  } finally {
    await db.sequelize.close();
  }
}

testFemaleMassageFaqsApi();
