const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyDbTlJCEH5aVCsccYENDkGSCVFWhdf5Ikk';

async function test() {
  console.log('API KEY:', apiKey);
  
  // Test Places API (New) Text Search with wildcard or different field mask
  const searchUrl = 'https://places.googleapis.com/v1/places:searchText';
  try {
    const res = await axios.post(searchUrl, {
      textQuery: 'BeauDeluxe'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': '*'
      }
    });
    console.log('Places API (New) Search Response:', JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error('Error in New Places API:', err.response ? err.response.data : err.message);
  }
}

test().catch(console.error);
