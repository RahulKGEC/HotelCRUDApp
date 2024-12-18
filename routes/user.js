const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user.js");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");


router.route("/signup").get( userController.renderSignupForm).post( wrapAsync(userController.signup));
router.route("/login").get( userController.renderLoginForm).post( saveRedirectUrl, passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
}), userController.login);





// Render the signup page
// router.get("/signup", userController.renderSignupForm );

// Handle user signup
// router.post("/signup", wrapAsync(userController.signup));

// Render the login page
// router.get("/login", userController.renderLoginForm );

// Handle user login
// router.post("/login", saveRedirectUrl, passport.authenticate('local', {
//     failureRedirect: '/login',
//     failureFlash: true,
// }), userController.login);

// Handle user logout
router.get("/logout", userController.logout);

// Export the router
module.exports = router;
