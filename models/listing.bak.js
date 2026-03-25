const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default: 
        "https://unsplash.com/photos/the-night-sky-is-filled-with-stars-above-a-mountain-range--Mbfhs0u4YQ",
        set: (v) => v === "" 
        ? "https://unsplash.com/photos/the-night-sky-is-filled-with-stars-above-a-mountain-range--Mbfhs0u4YQ" 
        : v,
    },
    price: Number,
    location: String,
    country: String
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;