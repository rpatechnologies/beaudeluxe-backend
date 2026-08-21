process.env.NODE_ENV = 'production';	//development, production

const express = require('express');
const dotenv = require("dotenv").config({ path: `./.env.${process.env.NODE_ENV}` });
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const multer = require("multer");
const cors = require('cors');

const port = process.env.PORT || 3000;
global.siteName = process.env.SITE_NAME;
global.siteUrl = process.env.SITE_URL;
global.currency = 'AED';

const app = express();
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "src/views"));
app.use(express.static(path.join(__dirname, "public")));


app.use(cors());
app.options("*", cors());
// Enable CORS for all routes

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
	}
}));
app.use(express.json());
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(flash());
app.use((req, res, next) => {
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

const webRoutes = require('./src/routes/web');
app.use('/', webRoutes);


// app.use(cors()); 
// const corsOptions = {
//   origin: 'https://beaudeluxe.vercel.app', // Allow only this domain
//   methods: 'GET,POST,PUT,DELETE',
//   allowedHeaders: 'Content-Type,Authorization',
//   credentials: true, 
// };

// app.use(cors(corsOptions));

const cleanSpacesInObject = (obj, seen = new WeakSet()) => {
	if (obj === null || obj === undefined) return obj;
	if (typeof obj.toJSON === 'function' && typeof obj !== 'function') {
		obj = obj.toJSON();
	}
	if (typeof obj === 'string') {
		if (obj.includes('/uploads/') || obj.startsWith('http://') || obj.startsWith('https://')) {
			return obj.replace(/\s+/g, '-').replace(/%20/g, '-');
		}
		return obj;
	}
	if (typeof obj !== 'object') {
		return obj;
	}
	if (seen.has(obj)) {
		return obj;
	}
	seen.add(obj);

	if (Array.isArray(obj)) {
		return obj.map(item => cleanSpacesInObject(item, seen));
	}
	if (typeof obj === 'object') {
		const cleaned = {};
		for (const key of Object.keys(obj)) {
			let val = obj[key];
			if (typeof val === 'string') {
				const isImageKey = /image|logo|photo|icon|banner|flag|file|picture|avatar|thumbnail/i.test(key);
				if (isImageKey || val.includes('/uploads/')) {
					val = val.replace(/\s+/g, '-').replace(/%20/g, '-');
				}
			} else if (typeof val === 'object' && val !== null) {
				val = cleanSpacesInObject(val, seen);
			}
			cleaned[key] = val;
		}
		return cleaned;
	}
	return obj;
};

const apiRoutes = require('./src/routes/api');
app.use('/api', (req, res, next) => {
	const originalJson = res.json;
	res.json = function (body) {
		if (body && typeof body === 'object') {
			body = cleanSpacesInObject(body);
		}
		return originalJson.call(this, body);
	};
	next();
}, apiRoutes);

const db = require("./src/models");
//{ force: true }{alter: true}
// db.sequelize.sync()
// .then(() => {
// 	console.log("Synced db.");
// })
// .catch((err) => {
// 	console.log("Failed to sync db: " + err.message);
// });
var upload = multer();
app.use(upload.array());

// app.listen(port, () => {
// 	console.log(`Server is Up and Running at Port - ${port}\nVisit it on http://127.0.0.1:${port}/ or http://localhost:${port}/`);
// })

//{ force: true }{alter: true}{logging: true}
db.sequelize.sync()
	.then(async () => {
		try {
			await db.sequelize.query("ALTER TABLE faqs ADD COLUMN category VARCHAR(255) NOT NULL DEFAULT 'About';");
		} catch (e) {
			if (e.original && e.original.errno !== 1060) {
				console.error("FAQ schema sync error:", e);
			}
		}
		try {
			await db.sequelize.query("ALTER TABLE sub_services ADD COLUMN gender VARCHAR(255) NOT NULL DEFAULT 'Both';");
		} catch (e) {
			if (e.original && e.original.errno !== 1060) {
				console.error("SubServices gender schema sync error:", e);
			}
		}
		try {
			await db.sequelize.query("ALTER TABLE form_appointments ADD COLUMN gender VARCHAR(255);");
		} catch (e) {
			if (e.original && e.original.errno !== 1060) {
				console.error("form_appointments schema sync error:", e);
			}
		}
		try {
			await db.sequelize.query("ALTER TABLE banners ADD COLUMN service_title VARCHAR(255);");
		} catch (e) {
			if (e.original && e.original.errno !== 1060) {
				console.error("Banners service_title schema sync error:", e);
			}
		}
		app.listen(port, () => {
			console.log(`Server is Up and Running at Port - ${port}\nVisit it on http://127.0.0.1:${port}/ or http://localhost:${port}/`);
		})
	})
	.catch((err) => {
		// console.log("Failed to sync db: " + err.message);
		console.log("Failed to sync db ", err);
	});
