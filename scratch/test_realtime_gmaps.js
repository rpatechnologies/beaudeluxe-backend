const axios = require('axios');

async function testRealtimeGoogleMaps() {
  try {
    console.log('--- FETCHING REAL-TIME GOOGLE MAPS PAGE FOR BEAUDELUXE ---');
    
    // We can fetch Google Maps place details using Google Maps URL / Search
    const searchUrl = 'https://www.google.com/maps/search/BeauDeluxe+Home+Spa+Massage+Dubai';
    const res = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    console.log('Response Status:', res.status);
    console.log('HTML Length:', res.data.length);

    // Look for place ID / CID / Feature ID in response
    const data = res.data;
    
    // Check if place name or review texts appear in the initial JS data payload
    const matches = data.match(/Ahmad Jouni|Abdullah Aridi|Mylene|BeauDeluxe/g);
    console.log('Keyword matches in real-time response:', matches ? [...new Set(matches)] : 'None');

  } catch (err) {
    console.error('Error fetching real-time Google Maps:', err.message);
  }
}

testRealtimeGoogleMaps();
