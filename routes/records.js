const express = require("express")
const router = express.Router()
const Venue = require("../models/venue.js")
const Request = require("../models/request.js")
const Record = require("../models/record.js")

router.post("/:venueAlias", async (req, res) => {

    try {
   
        const venue = await Venue.findOne({venueAlias : req.params.venueAlias})

        if (!venue) {
            return res.status(404).json({ message : `Venue ${req.venue_alias} not found`})
        }

        const request = new Request({
            venue: venue._id,
            estimate: req.body.devices
        })

        const newRequest = await request.save()
        res.status(201).json({ message : newRequest })

    } catch (err) {
        res.status(500).json({ message : err })
    }

});

router.get("/", async (req, res) => {
    const records = await Record.find({})
    res.status(200).json({records: records})
})

// router.delete("/", async (req, res) => {
//     await Stat.deleteMany({})
//     res.status(200).json({message: "Deleted all stats"})
// })

router.post("/", async (req, res) => {
    const venue = await Venue.findOne({ venueAlias : "lances-coffee-house" })

    let start = 10;
    const end = 22;
    date = new Date(`2023-05-27T${start}:00:00.000Z`)
    await Record.deleteMany({});
    for (start ; start < 16; start ++) {
        const record = new Record({
                venue: venue._id,
                estimate: Math.floor(Math.random() * 100), 
                downtime: false,
                createdAt: new Date(`2023-05-27T${start}:00:00.000Z`),
                updatedAt: new Date(`2023-05-27T${start}:00:00.000Z`)
        });
        await record.save();
    }
    start = 10;
    for (start ; start <= end; start ++) {
        const record = new Record({
                venue: venue._id,
                estimate: Math.floor(Math.random() * 100), 
                downtime: false,
                createdAt: new Date(`2023-05-26T${start}:00:00.000Z`),
                updatedAt: new Date(`2023-05-26T${start}:00:00.000Z`)
        });
        await record.save();
    }

    res.status(200).json({message: "thanks"});
    
})

router.get("/change-name", async (req, res) => {
    const x = await Record.updateMany({}, {$rename : {"count" : "estimate"}})
    res.status(200).json({x});
})

module.exports = router;