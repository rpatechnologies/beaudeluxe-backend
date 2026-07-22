const form = require("../services/form.service");

function oldFormDataMiddleware(req, res, next) {
    const oldData = formService.getOldFormData();
    res.locals.oldData = oldData;
    formService.setOldFormData({}); // Clear old data after retrieving it
    next();
}

module.exports = oldFormDataMiddleware;


/**
 * use of this middleware
const oldFormDataMiddleware = require('./formMiddleware');
const formService = new FormService();
app.post('/submit', (req, res) => {
    formService.setOldFormData(req.body);
    res.redirect('/form');
}); 
**
**/
