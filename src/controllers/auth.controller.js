const { body, validationResult } = require('express-validator');
const bcrypt   = require("bcrypt");
const db = require("../models");
const Admin = db.admin;
 
module.exports = {

    login: async function (req, res) {
        res.render("auth/login", {metaTitle: siteName + " - Admin Login"});
    },

    authenticate: async function (req, res) {
 
        const { email, password } = req.body

        await body('email','Email is required.').isEmail().normalizeEmail().run(req);
        await body('password','Password is required.').notEmpty().run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash("error", errors.array()[0].msg);
            res.redirect('back');
            return;
        }
        // console.log(await bcrypt.hash("123456", 10))
        try {
            const admin = await Admin.findOne({ where: { email } });
            if(!admin) 
            {
                req.flash("error", "Invalid login details.");
                res.redirect('back');
                return;
            }

            bcrypt.compare(password, admin.password, async (bErr, bResult) => {
                // console.log(bResult)
                if(bErr) 
                {
                    req.flash("error", "Invalid login details.");
                    res.redirect('back');
                    return;
                }
                if(bResult) 
                {
                    req.session.loggedIn = true;
                    req.session.admin_id = admin.id;
                    res.redirect('/dashboard');
                    return;
                }
                req.flash("error", "Invalid login details.");
                res.redirect('back');
                return;
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    logout: async function (req, res) {
        req.session.destroy();
        res.redirect("/");
    },
};
