require('dotenv').config();
const models = require('../src/models');

async function testDB() {
  try {
    await models.sequelize.authenticate();
    console.log('Database connection successful!');
    
    // Check testimonials count
    if (models.testimonials) {
      const testimonialsCount = await models.testimonials.count();
      console.log('Testimonials count:', testimonialsCount);

      const testimonials = await models.testimonials.findAll({ limit: 5 });
      console.log('Sample testimonials:', JSON.stringify(testimonials, null, 2));
    }

    // Check all model names registered
    console.log('Registered models:', Object.keys(models));
  } catch (err) {
    console.error('DB Error:', err.message);
  } finally {
    process.exit();
  }
}

testDB();
