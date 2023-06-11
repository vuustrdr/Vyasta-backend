const mongoose = require("mongoose")

const timesSchema = new mongoose.Schema({
    
    venue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Venue",
        required: true,
        unique: true
    },
    times: [{
        day: {
            type: Number, //eg. 0-6
            required: true,
        },
        open: {
            type: String, //UTC version of time. Eg 9.5 = 09:30:00
            required: true,
        },
        close: {
            type: String,
            required: true,
        },
        _id: false
    }],
    specialTimes: [{
        day: {
            type: Number, //eg. 0-6
            required: true,
        },
        open: {
            type: String, //UTC version of time. Eg 9.5 = 09:30:00
            required: true,
        },
        close: {
            type: String,
            required: true,
        },
        _id: false
    }]
})

module.exports = mongoose.model("Time", timesSchema)
