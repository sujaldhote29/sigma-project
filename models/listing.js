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
        default: "https://plus.unsplash.com/premium_photo-1675805016043-0166fc57ad01?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v) => v === "" ? "https://plus.unsplash.com/premium_photo-1675805016043-0166fc57ad01?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
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