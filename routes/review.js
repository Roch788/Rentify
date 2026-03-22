const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js")

const{validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js")
const ReveiwController=require("../controllers/reviews.js")
router.post("/",isLoggedIn, validateReview, wrapAsync(ReveiwController.createReview))

//delete route

router.delete("/:reviewId", isReviewAuthor,wrapAsync(ReveiwController.destroyReview))
module.exports = router;