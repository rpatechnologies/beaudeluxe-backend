require('dotenv').config();
const googleReviewController = require('../src/controllers/api/googleReview.controller');

async function testAll() {
  console.log("=== TEST 1: GET ALL REVIEWS (NO LIMIT) ===");
  const req1 = { query: { refresh: 'true' } };
  const res1 = {
    statusCode: 200,
    status: function(code) { this.statusCode = code; return this; },
    json: function(data) {
      console.log("Status:", data.status, "| Total Reviews Returned:", data.data.reviews_count);
    }
  };
  await googleReviewController.getGoogleReviews(req1, res1);

  console.log("\n=== TEST 2: GET TOP 10 REVIEWS (limit=10) ===");
  const req2 = { query: { limit: '10' } };
  const res2 = {
    statusCode: 200,
    status: function(code) { this.statusCode = code; return this; },
    json: function(data) {
      console.log("Status:", data.status, "| Reviews Returned:", data.data.reviews_count);
    }
  };
  await googleReviewController.getGoogleReviews(req2, res2);

  console.log("\n=== TEST 3: SYNC NEW GOOGLE REVIEW ===");
  const req3 = {
    body: {
      reviews: [
        {
          author_name: "Test User",
          rating: 5,
          relative_time_description: "Just now",
          text: "Amazing mobile spa service in Dubai!"
        }
      ]
    }
  };
  const res3 = {
    statusCode: 200,
    status: function(code) { this.statusCode = code; return this; },
    json: function(data) {
      console.log("Sync Response:", data.message, "| New Total:", data.data ? data.data.total_reviews : 0);
    }
  };
  await googleReviewController.syncGoogleReviews(req3, res3);
}

testAll().catch(console.error);
