const axios = require('axios');

async function extractGmapsDetails() {
  try {
    const searchUrl = 'https://www.google.com/maps/search/BeauDeluxe+Home+Spa+Massage+Dubai';
    const res = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    const html = res.data;
    const idx = html.indexOf('BeauDeluxe Home Spa Massage Dubai');
    if (idx !== -1) {
      console.log('Snippet after BeauDeluxe:');
      const sub = html.substring(idx, idx + 4000);
      console.log(sub);
      
      // Look for numbers like 0x... or 10... or https://
      const urls = sub.match(/https?:\/\/[^\s"'\\]+/g);
      console.log('URLs in snippet:', urls);

      const featureIds = sub.match(/0x[0-9a-fA-F]+:0x[0-9a-fA-F]+/g);
      console.log('Feature IDs in snippet:', featureIds);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

extractGmapsDetails();
