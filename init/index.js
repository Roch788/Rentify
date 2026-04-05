require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MongoURL = process.env.ATLASDB_URL;
// 🔥 replace with your actual user id
const demoUserId = new mongoose.Types.ObjectId("699db08e824a74a984482166");

async function main() {
    await mongoose.connect(MongoURL);
    console.log("Connected to Db");

    await initDb();
}

const initDb = async () => {
    try {
        // 🔥 delete old data
        await Listing.deleteMany({});
        console.log("Old data deleted");

        // 🔥 attach owner properly
        const updatedData = initData.data.map((obj) => ({
            ...obj,
            owner: demoUserId
        }));

        // 🔥 insert new data
        await Listing.insertMany(updatedData);

        console.log("Data initialized successfully ✅");

    } catch (err) {
        console.log("Error:", err);
    } finally {
        mongoose.connection.close(); // 🔥 important
    }
};

main();