process.env.NODE_ENV = 'production';
const dotenv = require("dotenv").config({ path: `./.env.${process.env.NODE_ENV}` });
global.siteName = process.env.SITE_NAME || 'BeauDeluxe';
global.siteUrl = process.env.SITE_URL || 'http://localhost:4000';

const db = require("../src/models");
const serviceController = require("../src/controllers/api/service.controller");

async function runTest() {
  try {
    await db.sequelize.authenticate();
    console.log("Database connection OK.");

    const reqMock = {
      query: {
        slug: 'waxing'
      },
      body: {}
    };

    const resMock = {
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        this.body = data;
        return this;
      }
    };

    await serviceController.servicePost(reqMock, resMock);

    console.log("\n--- get_service_detail Response Sample ---");
    if (resMock.body && resMock.body.data && resMock.body.data.service) {
      const s = resMock.body.data.service;
      console.log("service.image:", s.image);
      console.log("service.logo:", s.logo);
      console.log("service.banner:", s.banner);
      console.log("service.banner_mob:", s.banner_mob);
      console.log("service.card:", s.card);
    } else {
      console.log("Response body:", JSON.stringify(resMock.body, null, 2));
    }
  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    await db.sequelize.close();
  }
}

runTest();
