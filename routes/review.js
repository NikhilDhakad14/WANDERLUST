const express=require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing=require("../models/listing.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middlewares.js");
const reviewController=require("../controllers/reviews.js");


//reviews
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.creatReview));


//review delete
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));
module.exports=router;