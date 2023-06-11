const mongoose = require("mongoose")

const recordSchema = new mongoose.Schema({

    venue:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Venue",
        required: true
    },
    estimate: {
        type: Number,
        required: true
    },
    downtime: {
        type: Boolean,
        required: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Record" , recordSchema)
