const express = require("express");
// const review = require("../models/review");
const router = express.Router({mergeParams : true});// parent route ke sath   koi parameter ko child route ke sath merge karne ke liye 
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js")
// const { reviewSchema} = require('../schema.js');
const Review = require("../models/review.js");
// const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")
const reviewController = require("../controllers/reviews.js")


//Reviews  //POST Review Route // wrapAsync - basic error handling har jagah ho raha hai
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));


//Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;