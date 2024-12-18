const User = require("../models/user")


module.exports.renderSignupForm =(req, res) => {
    res.render("users/signup.ejs");
}


module.exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username }); // Create a new user object
        const registeredUser = await User.register(newUser, password); // Register the new user in the database
        console.log(registeredUser); // Log the registered user

        // Log in the user after registration
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err); // Handle any errors during login
            }
            req.flash("success", "Welcome to Wanderlust"); // Success message
            res.redirect("/listings"); // Redirect to listings
        });
    } catch (e) {
        req.flash("error", e.message); // Flash error message if registration fails
        res.redirect("/signup"); // Redirect back to signup page
    }
}


module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

// module.exports.login = async (req, res) => {
//     req.flash("success", "Welcome back to Wanderlust!"); // Success message on login
//     let redirectUrl = res.locals.redirectUrl || "/listings";
//     res.redirect(redirectUrl); // Redirect to the saved URL
// };

//chatgpt below 
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    
    // Use the redirect URL if available, otherwise fall back to "/listings"
    const redirectUrl = res.locals.redirectUrl || "/listings";
    
    // Clear the redirect URL in `res.locals` after use
    delete res.locals.redirectUrl;
  
    res.redirect(redirectUrl);
  };
  



module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err); // Handle any errors during logout
        }
        req.flash("success", "You are logged out!"); // Success message on logout
        res.redirect("/listings"); // Redirect to listings
    });
}