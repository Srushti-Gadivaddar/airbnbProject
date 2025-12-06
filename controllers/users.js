const { saveRedirectUrl } = require("../middleware.js");
const User = require("../models/user.js");

module.exports.rendersignUpform = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signUp = async(req, res) => {
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
             if(err) {
                return next(err);
            }

            req.flash("success", "Welcome to Wonderlust!");
            res.redirect("/listings");
        })
    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    };
    
};

module.exports.renderLoginform =  (req, res) => {
    res.render("users/login.ejs");
};

module.exports.Login =  async(req, res) => {
           req.flash( "success", "Welcome back to Wonderlust!");
        //    let redirectUrl = req.session.redirectUrl || "/listings";
        //    console.log(redirectUrl);
           res.redirect("/listings");
};

module.exports.logoutUser = (req, res, nrxt) => {
    req.logOut((err) => {
        if(err) {
           return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};