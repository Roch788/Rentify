const mongoose = require("mongoose");
const Review = require("./review")
const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        url: String,
        filename: String,
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },
    location: String,
    country: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });  //agar _id in reviews wali id ka part hongi toh delete ho jaayegi
    }
})

const Listing = mongoose.model("Listing", listingSchema)
module.exports = Listing
