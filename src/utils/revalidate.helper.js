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
 * Sends a revalidation request to the Next.js frontend application.
 * @param {string|string[]} [tags] - Tag(s) to revalidate
 * @param {string|string[]} [paths] - Path(s) to revalidate
 */
const triggerRevalidate = async (tags = [], paths = []) => {
  try {
    const frontendUrl = process.env.NEXTJS_FRONTEND_URL || "http://localhost:3000";
    const secret = process.env.NEXTJS_REVALIDATE_SECRET || "beaudeluxe_revalidate_secret_2026";

    // Normalize inputs to arrays
    const tagList = Array.isArray(tags) ? tags : (tags ? [tags] : []);
    const pathList = Array.isArray(paths) ? paths : (paths ? [paths] : []);

    const endpoint = `${frontendUrl.replace(/\/$/, '')}/api/revalidate`;

    console.log(`[Revalidate] Triggering revalidation at ${endpoint}`);
    if (tagList.length) console.log(`[Revalidate] Tags:`, tagList);
    if (pathList.length) console.log(`[Revalidate] Paths:`, pathList);

    const response = await axios.post(
      endpoint,
      {
        secret,
        tags: tagList,
        paths: pathList,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-revalidate-secret': secret
        },
        timeout: 5000 // 5 seconds non-blocking timeout
      }
    );

    console.log(`[Revalidate] Next.js revalidation successful:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[Revalidate Warning] Failed to trigger Next.js revalidation:`, error?.response?.data || error.message);
    return { success: false, error: error?.response?.data || error.message };
  }
};

/**
 * Helper to revalidate specific tags
 * @param {string|string[]} tags
 */
const revalidateTags = (tags) => {
  return triggerRevalidate(tags, []);
};

/**
 * Helper to revalidate specific paths
 * @param {string|string[]} paths
 */
const revalidatePaths = (paths) => {
  return triggerRevalidate([], paths);
};

/**
 * Helper to revalidate all default tags and paths
 */
const revalidateAll = () => {
  return triggerRevalidate(DEFAULT_TAGS, DEFAULT_PATHS);
};

module.exports = {
  DEFAULT_TAGS,
  DEFAULT_PATHS,
  triggerRevalidate,
  revalidateTags,
  revalidatePaths,
  revalidateAll,
};
