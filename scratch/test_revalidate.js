const axios = require('axios');

async function testRevalidate() {
  const url = "https://staging.dkph4vur59we8.amplifyapp.com/api/revalidate";
  const secret = "beaudeluxe-revalidate-af1f471fbdb07ef166c2fe491b5e1de61e346e393d8968fa5b72d4bbfc79914d";
  const payload = {
    secret,
    token: secret,
    REVALIDATE_SECRET: secret,
    REVALIDATE_SECRET_KEY: secret,
    tags: ["home-sections", "meta:home"],
    paths: ["/"],
    tag: "home-sections",
    path: "/"
  };

  console.log("Sending revalidation request to:", url);
  try {
    const res = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': secret,
        'authorization': `Bearer ${secret}`
      },
      timeout: 10000
    });
    console.log("Response Status:", res.status);
    console.log("Response Data:", JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error("Error Status:", err.response?.status);
    console.error("Error Data:", err.response?.data || err.message);
  }
}

testRevalidate();
