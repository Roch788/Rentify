const Listing = require("../models/listing")
const axios = require("axios");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings })
}

module.exports.renderNewForm = async (req, res) => {
    res.render("listings/new")
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews", populate: {
            path: "author",
        }
    }).populate("owner")
    if (!listing) {
        req.flash("error", "Listing you requested for doesn't exists")
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show", { listing })
}


module.exports.createListing = async (req, res) => {

    const { location, country } = req.body.listing;
    const query = `${location}, ${country}`;

    // ==============================
    // 🌍 MAP GEOCODING SECTION
    // Convert location + country → lat & lng using Nominatim
    // ==============================

    const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
            params: {
                q: query,
                format: "json",
                limit: 1
            },
            headers: {
                "User-Agent": "listing-app"
            }
        }
    );

    if (!response.data.length) {
        req.flash("error", "Location not found");
        return res.redirect("/listings/new");
    }

    const lat = parseFloat(response.data[0].lat);
    const lng = parseFloat(response.data[0].lon);

    // ==============================
    // 📦 CREATE NEW LISTING
    // ==============================

    const newListing = new Listing({
        ...req.body.listing,
        lat: lat,
        lng: lng
    });

    // Image handling
    if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    newListing.owner = req.user._id;

    await newListing.save();

    req.flash("success", "New listing created!");
    res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for doesn't exists")
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")
    res.render("listings/edit.ejs", { listing, originalImageUrl })
}
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing Updated")
    res.redirect(`/listings/${id}`)
}
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing)
    req.flash("success", "Listing deleted!")

    res.redirect("/listings");
}