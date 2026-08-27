const express = require('express');
const http = require('http');
const apiSecurity = require('../src/middlewares/apiSecurity');

const app = express();
app.use('/api', apiSecurity, (req, res) => {
	res.json({ status: true, message: 'Data fetched successfully.', data: [] });
});

const server = app.listen(0, async () => {
	const port = server.address().port;
	console.log(`Test server running on port ${port}`);

	const makeRequest = (headers) => {
		return new Promise((resolve, reject) => {
			const req = http.request({
				hostname: 'localhost',
				port: port,
				path: '/api/sitemap',
				method: 'GET',
				headers: headers
			}, (res) => {
				let data = '';
				res.on('data', chunk => data += chunk);
				res.on('end', () => resolve({ statusCode: res.statusCode, body: JSON.parse(data) }));
			});
			req.on('error', reject);
			req.end();
		});
	};

	try {
		console.log('\n--- Test 1: Direct Browser Navigation (Address Bar) ---');
		const browserRes = await makeRequest({
			'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
			'sec-fetch-mode': 'navigate',
			'sec-fetch-dest': 'document'
		});
		console.log('Status Code:', browserRes.statusCode);
		console.log('Response Body:', browserRes.body);
		if (browserRes.statusCode === 403) {
			console.log('SUCCESS: Direct browser navigation blocked with 403 Forbidden!');
		} else {
			console.error('FAILED: Direct browser navigation was not blocked!');
		}

		console.log('\n--- Test 2: Programmatic API Fetch (AJAX / Client Fetch) ---');
		const apiRes = await makeRequest({
			'accept': 'application/json, text/plain, */*',
			'sec-fetch-mode': 'cors',
			'sec-fetch-dest': 'empty'
		});
		console.log('Status Code:', apiRes.statusCode);
		console.log('Response Body:', apiRes.body);
		if (apiRes.statusCode === 200) {
			console.log('SUCCESS: Programmatic API call allowed!');
		} else {
			console.error('FAILED: Programmatic API call blocked!');
		}

	} catch (err) {
		console.error('Test error:', err);
	} finally {
		server.close();
		process.exit(0);
	}
});
