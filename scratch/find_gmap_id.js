const axios = require('axios');

async function findBeauDeluxeGMapData() {
  try {
    const url = 'https://www.google.com/maps/search/BeauDeluxe+Dubai';
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    const html = response.data;
    console.log('HTML Length:', html.length);
    
    // Search for feature_id or place_id patterns (0x...:0x...)
    const featureIdMatches = html.match(/0x[0-9a-fA-F]+:0x[0-9a-fA-F]+/g);
    console.log('Feature ID matches:', featureIdMatches ? [...new Set(featureIdMatches)] : 'None');

    // Search for place id
    const placeIdMatches = html.match(/ChIJ[a-zA-Z0-9_-]{23}/g);
    console.log('Place ID matches:', placeIdMatches ? [...new Set(placeIdMatches)] : 'None');

  } catch (err) {
    console.error('Error fetching Google Maps page:', err.message);
  }
}

findBeauDeluxeGMapData();
