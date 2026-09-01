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
 * Trigger Next.js cache revalidation for given tags and/or paths.
 * 
 * @param {Object} options
 * @param {string[]|string} [options.tags] - Next.js cache tag(s) to revalidate
 * @param {string[]|string} [options.paths] - Next.js path(s) to revalidate
 * @returns {Promise<Object>} Result of revalidation call
 */
async function revalidateNextCache({ tags = [], paths = [] } = {}) {
  const nextFrontendUrl = process.env.NEXTJS_FRONTEND_URL || 'http://localhost:3000';
  const secret = process.env.NEXTJS_REVALIDATE_SECRET || 'beaudeluxe_revalidate_secret_2026';
  
  // Format arrays
  const formattedTags = Array.isArray(tags) ? tags : [tags].filter(Boolean);
  const formattedPaths = Array.isArray(paths) ? paths : [paths].filter(Boolean);

  if (formattedTags.length === 0 && formattedPaths.length === 0) {
    console.warn('[NextJS Revalidate] No tags or paths specified for revalidation.');
    return { success: false, reason: 'No tags or paths provided' };
  }

  const endpoint = `${nextFrontendUrl.replace(/\/$/, '')}/api/revalidate`;

  try {
    const response = await axios.post(
      endpoint,
      {
        tags: formattedTags,
        paths: formattedPaths,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-revalidate-secret': secret,
        },
        timeout: 5000, // 5 second timeout so backend doesn't hang
      }
    );

    console.log(`[NextJS Revalidate] Successfully revalidated. Tags: [${formattedTags.join(', ')}], Paths: [${formattedPaths.join(', ')}]`);
    return { success: true, data: response.data };
  } catch (error) {
    // Non-blocking log so admin operation succeeds even if Next.js server is unreachable
    console.error(`[NextJS Revalidate Error] Failed to revalidate Next.js cache at ${endpoint}:`, error.response?.data || error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Revalidate all default tags and paths in Next.js
 */
async function revalidateAllNextCache() {
  return await revalidateNextCache({
    tags: DEFAULT_TAGS,
    paths: DEFAULT_PATHS,
  });
}

module.exports = {
  DEFAULT_TAGS,
  DEFAULT_PATHS,
  revalidateNextCache,
  revalidateAllNextCache,
};
