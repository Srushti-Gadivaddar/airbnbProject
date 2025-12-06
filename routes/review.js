const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/WrapAsync.js");
const Listing = require("../models/listings");
const Reviews = require("../models/review.js");
const { validateReviews, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewsController = require("../controllers/reviews.js");

//reviews creation
//post route
router.post("/", isLoggedIn,validateReviews, wrapAsync(reviewsController.createReview));

//delete review Delete route,
router.delete("/:reviewId", isLoggedIn,isReviewAuthor, wrapAsync(reviewsController.destroyReview));

module.exports = router;

