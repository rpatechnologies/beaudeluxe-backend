const axios = require('axios');

async function parseGmapsPayload() {
  try {
    const searchUrl = 'https://www.google.com/maps/search/BeauDeluxe+Home+Spa+Massage+Dubai';
    const res = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    const html = res.data;
    
    // Find window.APP_INITIALIZATION_STATE
    const initStateMatch = html.match(/window\.APP_INITIALIZATION_STATE\s*=\s*(.*?);window\.APP_FLAGS/s);
    if (initStateMatch) {
      console.log('Found APP_INITIALIZATION_STATE! String length:', initStateMatch[1].length);
      
      // Look for hex patterns 0x...
      const hexMatches = initStateMatch[1].match(/0x[0-9a-fA-F]+:0x[0-9a-fA-F]+/g);
      console.log('Hex feature matches:', hexMatches ? [...new Set(hexMatches)] : 'None');

      // Look for ChIJ place IDs
      const placeIdMatches = initStateMatch[1].match(/ChIJ[a-zA-Z0-9_-]{23}/g);
      console.log('Place ID matches:', placeIdMatches ? [...new Set(placeIdMatches)] : 'None');

      // Search for URL or listing title
      const titleMatches = initStateMatch[1].match(/"BeauDeluxe[^"]*"/g);
      console.log('Title matches:', titleMatches ? [...new Set(titleMatches)] : 'None');
    } else {
      console.log('APP_INITIALIZATION_STATE not matched.');
    }

  } catch (err) {
    console.error('Error:', err.message);
  }
}

parseGmapsPayload();
