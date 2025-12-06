const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userControllers = require("../controllers/users.js");

//Signup routes
router.route("/signup")
.get(userControllers.rendersignUpform)
.post(WrapAsync(userControllers.signUp));


//Login routes
router.route("/login")
.get(userControllers.renderLoginform)
.post(
    passport.authenticate("local", {failureRedirect: '/login', failureFlash: true}) ,
       userControllers.Login);


router.get("/logout", userControllers.logoutUser);

module.exports = router;