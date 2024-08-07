const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected to db");
})
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
     initData.data = initData.data.map((obj) => {
        return {...obj, owner: "66b3283b5697cf3412871dbd"};
    });
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};


initDB();