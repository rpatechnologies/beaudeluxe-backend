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
  const envUrl = process.env.NEXTJS_FRONTEND_URL || "https://staging.dkph4vur59we8.amplifyapp.com";
  const secret = process.env.NEXTJS_REVALIDATE_SECRET || process.env.REVALIDATE_SECRET || "beaudeluxe_revalidate_secret_2026";

  // Split comma-separated URLs
  const frontendUrls = envUrl.split(',').map(u => u.trim()).filter(Boolean);

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
          timeout: 10000
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
