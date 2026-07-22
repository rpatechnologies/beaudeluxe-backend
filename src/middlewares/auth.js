
const authorized = function (req, res, next) {
	const environment = process.env.NODE_ENV;
	if(environment=='development')
	{
		req.session.loggedIn   = true;
		req.session.admin_id   = 1;
	}
	if (req.session.loggedIn) {
		console.log("User is authenticated.",req.session.loggedIn);
		next();
	} else {
		res.redirect('/');
	}
}
 
module.exports = authorized;
 