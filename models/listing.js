const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: "https://unsplash.com/photos/a-green-and-blue-sky-with-a-lot-of-snow-4gIJkfVcnWM",
        set: (v) => v === "" ? "https://unsplash.com/photos/a-green-and-blue-sky-with-a-lot-of-snow-4gIJkfVcnWM" : v,
    },
    price: {
        type: Number,
        default: 0,
        min: 0
    },
    location: {
        type: String,
        default: ""
    },
    country: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;