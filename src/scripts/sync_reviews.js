require('dotenv').config();
const axios = require('axios');
const path = require('path');
const fs = require('fs');

async function syncGoogleReviewsScript() {
  console.log('=== STARTING GOOGLE REVIEWS SYNC ===');
  
  const gmbAccountId = process.env.GOOGLE_BUSINESS_ACCOUNT_ID;
  const gmbLocationId = process.env.GOOGLE_BUSINESS_LOCATION_ID;
  const gmbAccessToken = process.env.GOOGLE_BUSINESS_ACCESS_TOKEN;
  const outscraperKey = process.env.OUTSCRAPER_API_KEY;

  let fetchedReviews = [];

  // 1. Try Google Business Profile API
  if (gmbAccountId && gmbLocationId && gmbAccessToken) {
    try {
      console.log('Fetching directly from Google Business Profile API...');
      let pageToken = null;
      do {
        let url = `https://mybusinessreviews.googleapis.com/v1/accounts/${gmbAccountId}/locations/${gmbLocationId}/reviews?pageSize=50`;
        if (pageToken) url += `&pageToken=${pageToken}`;

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${gmbAccessToken}` }
        });

        if (res.data && res.data.reviews) {
          const mapped = res.data.reviews.map(r => ({
            author_name: r.reviewer?.displayName || "Google User",
            author_url: r.reviewer?.profilePhotoUrl || "",
            profile_photo_url: r.reviewer?.profilePhotoUrl || "",
            rating: r.starRating === "FIVE" ? 5 : r.starRating === "FOUR" ? 4 : r.starRating === "THREE" ? 3 : r.starRating === "TWO" ? 2 : 1,
            relative_time_description: r.createTime ? new Date(r.createTime).toLocaleDateString() : "",
            text: r.comment || "",
            time: r.createTime ? Math.floor(new Date(r.createTime).getTime() / 1000) : Math.floor(Date.now() / 1000)
          }));
          fetchedReviews.push(...mapped);
        }
        pageToken = res.data?.nextPageToken;
      } while (pageToken);
      console.log(`Fetched ${fetchedReviews.length} reviews from Google Business Profile API.`);
    } catch (err) {
      console.error('Google Business Profile API error:', err.message);
    }
  }

  // 2. Try Outscraper API
  if (fetchedReviews.length === 0 && outscraperKey) {
    try {
      console.log('Fetching directly from Outscraper Google Maps API...');
      const placeId = process.env.GOOGLE_PLACE_ID || "BeauDeluxe Home Spa Massage Dubai";
      const url = `https://api.outscraper.com/maps/reviews-v3?query=${encodeURIComponent(placeId)}&async=false`;
      const res = await axios.get(url, { headers: { "X-API-KEY": outscraperKey } });

      if (res.data?.data?.[0]?.reviews_data) {
        fetchedReviews = res.data.data[0].reviews_data.map(r => ({
          author_name: r.author_title || "Google User",
          author_url: r.author_link || "",
          profile_photo_url: r.author_image || "",
          rating: r.review_rating || 5,
          relative_time_description: r.review_datetime_utc || r.review_timestamp || "",
          text: r.review_text || "",
          time: r.review_timestamp || Math.floor(Date.now() / 1000)
        }));
        console.log(`Fetched ${fetchedReviews.length} reviews from Outscraper.`);
      }
    } catch (err) {
      console.error('Outscraper API error:', err.message);
    }
  }

  // Save to dataset file
  if (fetchedReviews.length > 0) {
    const datasetPath = path.join(__dirname, '../data/google_reviews_dataset.json');
    let existing = [];
    if (fs.existsSync(datasetPath)) {
      existing = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
    }

    fetchedReviews.forEach(fr => {
      if (!existing.some(er => er.author_name === fr.author_name && er.text === fr.text)) {
        existing.unshift(fr);
      }
    });

    fs.writeFileSync(datasetPath, JSON.stringify(existing, null, 2));
    console.log(`=== SYNC COMPLETE! Total reviews in dataset: ${existing.length} ===`);
  } else {
    console.log('No new reviews fetched. Please ensure Google API credentials or Outscraper key are configured in .env');
  }
}

syncGoogleReviewsScript().catch(console.error);
