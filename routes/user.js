const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");


router
.route("/signup")
.get(userController.renderSignupForm) //render
.post(wrapAsync(userController.signup)); //signup

router
.route("/login")
.get(userController.renderLoginForm) //login
.post(
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: '/login',
        failureFlash: true,
     }),
     userController.login
); //now the request will go and the post request go to the post route

router.get("/logout", userController.logout);

module.exports = router;