const { reviewSchema } = require("../schema.js")
const Listing = require("../models/listing.js")
const ExpressError = require("../utils/customError.js")
const Review = require("../models/review.js")


module.exports.createReview=async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    
    listing.reviews.push(newReview._id);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`)
}

module.exports.destroyReview=async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })  //here $pull is an operator which is used to pull or remove an instance of object/id in the main listing schema
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`)
}