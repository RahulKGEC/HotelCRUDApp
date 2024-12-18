const Listing = require("./models/listing")
const Review = require("./models/review")
const { listingSchema , reviewSchema} = require("./schema.js")
const ExpressError = require("./utils/ExpressError.js")







// Middleware to check if a user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    // Uncomment this line to log the current path and original URL for debugging
    // console.log(req.path, "..", req.originalUrl); // This helps to understand where to redirect after login

    if (!req.isAuthenticated()) { // Check if the user is not authenticated
        req.session.redirectUrl = req.originalUrl; // Store the original URL in the session
        req.flash("error", "You must be logged in !"); // Flash error message
        return res.redirect("/login"); // Redirect to login page
    }
    next(); // Proceed to the next middleware or route handler if authenticated
}





// Middleware to save the redirect URL for after login
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) { // Check if there is a saved redirect URL
        res.locals.redirectUrl = req.session.redirectUrl; // Set it to locals for use in views
        delete req.session.redirectUrl; // Clear the redirect URL after saving it
    }
    next(); // Proceed to the next middleware or route handler
}






module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    //console.log(id)
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}



module.exports.isReviewAuthor = async (req, res, next) => {
    let {id , reviewId } = req.params;// show page ke taraf redirect karne ke liye id bhi hona chahiye isiliye id ko extract kiya hai
    //console.log(id)
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}




module.exports.validateListing = (req, res, next) => {
    //let {result}= listingSchema.validate(req.body);// extract kiya gaya error ko
    // if(result.error){
    //   throw new ExpressError(400, result.error)
    // }



    let { error } = listingSchema.validate(req.body);// extract kiya gaya error ko
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(',');//object ke form me details hai// error massage ke andar sara ka sara details hai usko map kae sakte hai
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}




module.exports.validateReview = (req, res, next) => {
    //let {result}= listingSchema.validate(req.body);// extract kiya gaya error ko
    // if(result.error){
    //   throw new ExpressError(400, result.error)
    // }

    let { error } = reviewSchema.validate(req.body);// extract kiya gaya error ko //reviewSchema Ke through validate karenge apne req.body ko agar koi error aa gaya to error ko throw karenge
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(',');//object ke form me details hai// error massage ke andar sara ka sara details hai usko map kae sakte hai
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}