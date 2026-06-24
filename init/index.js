const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected to DB")
}).catch(err => {
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});

    const categories = [
        "Trending",
        "Rooms",
        "Iconic-Cities",
        "Mountains",
        "Castles",
        "Amazing-Pools",
        "Camping",
        "Farms",
        "Arctic"
    ];
    initData.data = initData.data.map((obj, index) => ({...obj, owner: "6a33f3eb6ccb10024386f719", category: categories[index % categories.length]}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();