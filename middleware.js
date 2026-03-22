const Listing=require("./models/listing")
const { listingSchema } = require("./schema.js")
const { reviewSchema } = require("./schema.js")
const Review = require("./models/review.js")

const ExpressError = require("./utils/customError.js")
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //redirectUrl save
        req.session.redirectUrl=req.originalUrl;
        req.flash("error", "You must be logged in to create Listing")
        return res.redirect("/login")
    }
    next();
}

//middleware for saving our redirect url

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async  (req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    //authorization 
    if (res.locals.currUser && !listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You aren't the owner of this listing");
       return res.redirect(`/listings/${id}`);
    }
    next();
}
// middleware for validate listinz made by JOI
module.exports.validateListing = (err, req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',')
        throw new ExpressError(400, errMsg)
    } else {
        next();
    }
}
// middleware for validate review made by JOI
module.exports.validateReview = (err, req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let { errorMsg } = error.details.map((el) => el.message).join(',')
        throw new ExpressError(400, errorMsg)
    } else {
        next();
    }
}

module.exports.isReviewAuthor=async  (req,res,next)=>{
    let { id,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    //authorization 
    if (res.locals.currUser && !review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You didn't created this review");
       return res.redirect(`/listings/${id}`);
    }
    next();
}
