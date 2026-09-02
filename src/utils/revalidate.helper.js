const axios = require('axios');

const DEFAULT_TAGS = [
  "home-sections",
  "all-services",
  "about-sections",
  "female-massage-sections",
  "therapist-sections",
  "faqs",
  "testimonials-page",
  "google-reviews",
  "our-teams",
  "meta:home",
  "meta:services",
  "meta:about-us",
  "meta:faq",
  "meta:therapist",
  "meta:contact-us",
  "meta:gift-vouchers",
  "meta:terms-and-conditions",
  "meta:privacy-policy",
  "meta:services/female-massage",
];

const DEFAULT_PATHS = [
  "/",
  "/about-us",
  "/services",
  "/therapist",
  "/faq",
  "/giftvouchers",
  "/contact-us",
  "/testimonial",
  "/blogs",
  "/projects",
  "/privacy-policy",
  "/terms-and-conditions",
];

/**
 * Sends a revalidation request to the Next.js frontend application(s).
 * Accepts comma-separated URLs in NEXTJS_FRONTEND_URL.
 * @param {string|string[]} [tags] - Tag(s) to revalidate
 * @param {string|string[]} [paths] - Path(s) to revalidate
 */
const triggerRevalidate = async (tags = [], paths = []) => {
  // Clear backend Node.js in-memory cache first so API returns fresh database values
  try {
    const cache = require("memory-cache");
    cache.clear();
    console.log("[Revalidate] Cleared backend memory-cache.");
  } catch (e) {
    console.error("[Revalidate] Error clearing backend memory-cache:", e);
  }

  const envUrl = process.env.NEXTJS_FRONTEND_URL || "https://staging.dkph4vur59we8.amplifyapp.com,https://www.beaudeluxe.com";
  const secret = process.env.REVALIDATE_SECRET_KEY || process.env.NEXTJS_REVALIDATE_SECRET || process.env.REVALIDATE_SECRET || "beaudeluxe-revalidate-af1f471fbdb07ef166c2fe491b5e1de61e346e393d8968fa5b72d4bbfc79914d";

  // Split comma-separated URLs and normalize domain names for SSL certificate matching
  const frontendUrls = envUrl.split(',').map(u => u.trim().replace(/^https?:\/\/www\.beaudeluxe\.com/i, 'https://beaudeluxe.com')).filter(Boolean);

  // Auto-include local Next.js frontend in non-production environments if not already listed
  if (process.env.NODE_ENV !== 'production' && !frontendUrls.some(u => u.includes('localhost:3000'))) {
    frontendUrls.push("http://localhost:3000");
  }

  const tagList = Array.isArray(tags) ? tags : (tags ? [tags] : []);
  const pathList = Array.isArray(paths) ? paths : (paths ? [paths] : []);

  const results = [];

  for (const frontendUrl of frontendUrls) {
    const endpoint = `${frontendUrl.replace(/\/$/, '')}/api/revalidate`;

    console.log(`[Revalidate] Triggering revalidation at: ${endpoint}`);
    if (tagList.length) console.log(`[Revalidate] Tags:`, tagList);
    if (pathList.length) console.log(`[Revalidate] Paths:`, pathList);

    try {
      const payload = {
        secret,
        token: secret,
        REVALIDATE_SECRET: secret,
        tags: tagList,
        paths: pathList,
        tag: tagList[0] || "",
        path: pathList[0] || "/"
      };

      const response = await axios.post(
        endpoint,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-revalidate-secret': secret,
            'authorization': `Bearer ${secret}`
          },
          timeout: 5000
        }
      );

      console.log(`[Revalidate SUCCESS] ${endpoint}:`, response.data);
      results.push({ url: endpoint, success: true, data: response.data });
    } catch (error) {
      const status = error?.response?.status;
      const responseData = error?.response?.data;
      const errMsg = error?.message || "Unknown Error";
      const errCode = error?.code;

      console.error(`[Revalidate FAILED] ${endpoint} -> Status: ${status || 'No Response'}, Code: ${errCode || 'N/A'}, Message: ${errMsg}`);
      if (responseData) console.error(`[Revalidate Error Details]:`, responseData);

      results.push({
        url: endpoint,
        success: false,
        status,
        code: errCode,
        error: responseData || errMsg
      });
    }
  }

  return results.length === 1 ? results[0] : results;
};

const revalidateTags = (tags) => triggerRevalidate(tags, []);
const revalidatePaths = (paths) => triggerRevalidate([], paths);
const revalidateAll = () => triggerRevalidate(DEFAULT_TAGS, DEFAULT_PATHS);

module.exports = {
  DEFAULT_TAGS,
  DEFAULT_PATHS,
  triggerRevalidate,
  revalidateTags,
  revalidatePaths,
  revalidateAll,
};
