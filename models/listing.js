const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js"); // Make sure this path is correct

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: {
            type: String
        },
        url: {
            type: String,
        }
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

// Fixed post middleware - note the parameter name and property name corrections
listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing && listing.reviews && listing.reviews.length > 0){
         await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;