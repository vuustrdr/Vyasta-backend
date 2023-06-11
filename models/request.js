const mongoose = require("mongoose")

const requestSchema = new mongoose.Schema({

    venue:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Venue",
        required: true

    },
    estimate: {
        required: true,
        type: Number
    }

}, {
    timestamps: true
})

module.exports = mongoose.model("Request", requestSchema)