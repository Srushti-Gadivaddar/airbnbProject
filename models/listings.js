const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const listeningSchema = new Schema({
    title: String,
    description: String,
    image: {
        url: String,
        filename: String
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
    geometry: {
        type:{
            type: String,
            enum: ["point"],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        } 
    }
});

listeningSchema.post("findOneAndDelete", async(listing) => {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listeningSchema);

module.exports = Listing;