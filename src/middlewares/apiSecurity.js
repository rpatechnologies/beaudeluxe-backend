/**
 * API Security Middleware
 * Blocks direct browser address-bar navigation to /api/* routes
 * and enforces security headers/keys if configured.
 */
const apiSecurity = (req, res, next) => {
	const secFetchMode = req.headers['sec-fetch-mode'];
	const secFetchDest = req.headers['sec-fetch-dest'];
	const accept = req.headers['accept'] || '';
	const apiKey = req.headers['x-api-key'];
	const requestedWith = req.headers['x-requested-with'];

	// 1. Optional API Secret Key validation if ENFORCE_API_KEY is enabled in .env
	if (process.env.API_SECRET_KEY && process.env.ENFORCE_API_KEY === 'true') {
		if (apiKey !== process.env.API_SECRET_KEY) {
			return res.status(401).json({
				status: false,
				message: 'Unauthorized: Invalid or missing API key.'
			});
		}
	}

	// 2. Block direct browser navigation
	// Direct address bar navigation sends sec-fetch-mode: 'navigate', sec-fetch-dest: 'document', or Accept: text/html
	const isDirectBrowserNavigation =
		secFetchMode === 'navigate' ||
		secFetchDest === 'document' ||
		(accept.includes('text/html') && !accept.includes('application/json') && requestedWith !== 'XMLHttpRequest' && !apiKey);

	if (isDirectBrowserNavigation) {
		return res.status(403).json({
			status: false,
			message: 'Direct browser access to API endpoints is prohibited.'
		});
	}

	next();
};

module.exports = apiSecurity;
