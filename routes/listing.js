const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js")
const ListingController = require("../controllers/listings.js")
const multer = require("multer");
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage })
router.route("/")
    .get(wrapAsync(ListingController.index)) //for indexroute
    .post(validateListing, isLoggedIn, upload.single('listing[image]'), wrapAsync(ListingController.createListing)) //for create route
//new route
router.get("/new", isLoggedIn, wrapAsync(ListingController.renderNewForm))

router.route("/:id")
    .get(wrapAsync(ListingController.showListing)) //show route(read)
    .put(validateListing, isOwner, isLoggedIn, upload.single('listing[image]'),wrapAsync(ListingController.updateListing))//update route
    .delete(isOwner, isLoggedIn, wrapAsync(ListingController.destroyListing))//delete route

//edit route
router.get("/:id/edit", isLoggedIn, wrapAsync(ListingController.editListing))



module.exports = router;  
