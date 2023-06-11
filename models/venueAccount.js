const mongoose = require("mongoose");

const venueAccountSchema = new mongoose.Schema({

    venue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Venue",
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    key: { //randomly generated hash key
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("VenueAccount", venueAccountSchema)