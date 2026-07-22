process.env.NODE_ENV = 'production';
const dotenv = require("dotenv").config({ path: `./.env.${process.env.NODE_ENV}` });
global.siteName = process.env.SITE_NAME;
global.siteUrl = process.env.SITE_URL;

const db = require("./src/models");
const subserviceController = require("./src/controllers/subService.controller");

async function runTest() {
  try {
    await db.sequelize.authenticate();
    console.log("Database connection OK.");

    const reqMock = {
      body: {
        type: 'gender',
        subservice_id: 47
      }
    };

    const resMock = {
      json: function(data) {
        this.body = data;
        return this;
      }
    };

    await subserviceController.getCategory(reqMock, resMock);
    
    console.log("\n--- getCategory Response Sample ---");
    if (resMock.body && resMock.body.length > 0) {
      console.log(JSON.stringify(resMock.body[0], null, 2));
    } else {
      console.log("No categories returned.");
    }
  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    await db.sequelize.close();
  }
}

runTest();
