const mongoose = require("mongoose")

const venueSchema = new mongoose.Schema({

    venueAlias: {
        type: String,
        required: true,
        unique: true
    },
    displayName: {
        type: String
    },
    numberEmployees: {
        type: Number,
        required: true
    },
    constantDevices: {
        type: Number,
        required: true
    },
    customerDeviceAverage: {
        type: Number,
        required: true
    },
    version: {
        type: Number,
        required: true
    },
    currentTotal: {
        type: Number,
        required: true
    },
    requestsCount: {
        type: Number,
        required: true
    },
    maxCapacity: {
        type: Number,
        required: true
    },
    timeZoneId: {
        type: String,
        required: true
    }
}, 
{
    timestamps: true
});

module.exports = mongoose.model("Venue", venueSchema)

// Notes: mongoose.model("Venue", venueSchema)
//  mongoose creates a collection called "venues" with a schema for validation defined, anything then saved becomes a document 
//  conforming to this.