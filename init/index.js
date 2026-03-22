const mongoose = require("mongoose")
const initData = require("./data.js")
const Listing = require("../models/listing.js")
const Review = require("../models/review.js")
const MongoURL = 'mongodb://127.0.0.1:27017/WanderLust2';

main().then(() => {
    console.log("Connected to Db")
}).catch(err => {
    console.log("error aagya ");
})

async function main() {
    await mongoose.connect(MongoURL);
}

const initDb = async () => {
    // await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: '699db08e824a74a984482166' }))
    await Listing.insertMany(initData.data);
    console.log("Data initialised")
    // await Listing.deleteMany({price:"0"});
    // await Review.deleteMany({});
}
initDb();