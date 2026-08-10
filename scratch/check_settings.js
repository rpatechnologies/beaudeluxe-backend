require('dotenv').config();
const models = require('../src/models');
const { settingData } = require('../src/utils/global.helper');

async function checkSettings() {
  try {
    const settings = await settingData();
    console.log('All Settings from DB:', settings);

    if (models.setting) {
      const rawSettings = await models.setting.findAll();
      console.log('Raw Settings count:', rawSettings.length);
      rawSettings.forEach(s => {
        console.log(`${s.title || s.key || s.id}:`, s.value || s.settingValue || s);
      });
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit();
  }
}

checkSettings();
