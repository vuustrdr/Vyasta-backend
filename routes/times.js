const express = require("express")
const router = express.Router()
// const Time = require("../models/times.js")

// router.get("/", async (req, res) => {
//     const allTimes = await Time.find({})
//     res.status(200).json({times: allTimes})
// })

// router.post("/:venueId", async (req, res) => {
    
//     try {
//         //await Time.deleteMany({})
//         const time = new Time({
//             venue: req.params.venueId,
//             times: req.body.times
//         })
//         const newTime = time.save()

//         res.status(201).json({ message : newTime })

//     } catch (err) {
//         res.status(500).json({ message : err })
//     }

// })

// router.delete("/", async (req, res) => {
//     await Time.deleteMany({})
//     res.status(200).json({message: "Deleted all times"})
// })

module.exports = router;