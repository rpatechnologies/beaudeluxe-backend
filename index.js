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

const apiRoutes = require('./src/routes/api');
app.use('/api', apiRoutes);

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
	.then(() => {
		// console.log("Synced db.");
		app.listen(port, () => {
			console.log(`Server is Up and Running at Port - ${port}\nVisit it on http://127.0.0.1:${port}/ or http://localhost:${port}/`);
		})
	})
	.catch((err) => {
		// console.log("Failed to sync db: " + err.message);
		console.log("Failed to sync db ", err);
	});
