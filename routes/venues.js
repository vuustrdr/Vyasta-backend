const express = require("express");
const router = express.Router();
const Venue = require("../models/venue.js");
const Request = require("../models/request.js");
const Record = require("../models/record.js");
const Time = require("../models/times.js");

const dayArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

// Venue info page request
router.get("/:venueAlias", async (req, res) => {

    try {

        const venue = await Venue.findOne({ venueAlias : req.params.venueAlias });
    
        if (venue == null) return res.status(404).json({ message: "Venue not found" });

        const records = await Record.find({venue: venue._id}).sort({ createdAt: 1 }); //add stuff in herr 
    
        const dayStats = {};
        records.forEach(i => {
            //get date  bug is here i think, it shows as last month even if today; this isnt a prob if atuff is deleted right
            const date = new Date().getUTCDate() == i.createdAt.getUTCDate() ? `Today` : `${dayArray[i.createdAt.getUTCDay()]} ${i.createdAt.getUTCFullYear()}-${('0' + (i.createdAt.getUTCMonth() + 1)).slice(-2)}-${('0' + i.createdAt.getUTCDate()).slice(-2)}`
            
            const options = {
                timeZone: venue.timeZoneId,
                hour: 'numeric',
                minute: 'numeric',
                hour12: false,
            };

            
            if (!dayStats[date]) dayStats[date] = {};
            const time = i.createdAt.toLocaleString("en-US", options);
            dayStats[date][time] = {estimate: i.estimate, downtime: i.downtime};
        
        });

        const latestRequest = await Request.findOne({ venue : venue._id})
            .sort({ createdAt: -1 }).then(result => result ? result.estimate : 0);
 
        const times = await Time.findOne({venue: venue._id })

        const now = new Date();
        const year = now.getUTCFullYear();
        const month = ('0' + (now.getUTCMonth() + 1)).slice(-2);
        const day = ('0' + now.getUTCDate()).slice(-2);
        const dateStr = year + '-' + month + '-' + day;
    
        const utcDay = now.getUTCDay()
        const openFrom = new Date(`${dateStr}T${times.times[utcDay].open}Z`)
        const closedFrom = new Date(`${dateStr}T${times.times[utcDay].close}Z`)

        let open = true;
        if (now < openFrom || now >= closedFrom) open = false;
        res.status(200).json({ venueInfo : venue.displayName, venueAlias: venue.venueAlias, isOpen: open, latest : latestRequest, dayStats: dayStats });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

})

// router.get("/", async (req, res) => {
//     try {
//         const venues = await Venue.find()
//         res.status(200).json({ message : venues})
//     } catch (err) {
//         res.status(500).json({ message: err.message })
//     }
// })

// router.delete("/", async (req, res, next) => {
//     try {
//         const x = await Venue.deleteMany({})
//         res.status(200).json({ message : x })
//     } catch (err) {
//         res.status(404).json({ message : "Failed to delete all" })
//     }
// })

// router.get("/map/address", async (req, res) => {
//     const query = {venueAlias: 1, venueAddress: 1, _id: 0}
//     const venues = await Venue.find({}, query)
//     res.status(200).json({ message : venues})
// })

// router.delete("/:id", getVenueById, async (req, res) => {
//     res.json({ message : "Deleted"})
// })

// router.post("/", async (req, res) => {
    
//     const venue = new Venue({
//         venueAlias: req.body.venueAlias,
//         // venueAddress: {
//         //     latitude: req.body.venueAddress.latitude,
//         //     longitude: req.body.venueAddress.longitude
//         // },
//         numberEmployees: req.body.numberEmployees,
//         constantDevices: req.body.constantDevices,
//         customerDeviceAverage: req.body.customerDeviceAverage,
//         version: req.body.version,
//         currentTotal: 0,
//         requestsCount: 0,
//         maxCapacity: req.body.maxCapacity,
//         timeZoneId: req.body.timeZoneId

//     })

//     try {
//         const newVenue = await venue.save()
//         res.status(201).json({ message : newVenue })
//     } catch (err) {
//         res.status(400).json({ message : err.message })
//     }

// })

// router.get("/temp/:venueAlias", async (req, res) => {
//     const venue = await Venue.findOne({venueAlias: req.params.venueAlias});
//     venue.maxCapacity = 50;
//     venue.save();
// }) 

// async function getVenue(req, res, next) {

//     let venue;
//     let requests;
//     try {
//         venue = await Venue.findOne({ venueAlias : req.params.venueAlias })
//         if (venue == null) {
//             return res.status(404).json({ message: "Venue not found" })
//         }
//         requests = await Request.find({venue : venue._id})
//     } catch (err) {
//         return res.status(500).json({ message: err.message })
//     }


//     res.venue = venue
//     res.requests = requests
//     next()

// }

// async function getVenueById(req, res, next) {

//     try {
//         const venue = await Venue.findByIdAndDelete(req.params.id)
        
//         if (venue == null){
//             res.status(404).json({ message : "Delete succeeded"})
//         } else {
//             res.status(200).json({ message : "Delete succeeded"})
//         }

//     } catch (err) {
//         res.status(500).json({ message : "Delete failed"})
//     }

//     next()

// }

// async function getAddress(req, res, next) {
//     let result
//     const query = {venueAlias: 1, venueAddress: 1, _id: 0}

//     try {
//         const result = await Venue.find({}, query)
//         if (result == null) {
//             return res.status(404).json({ message: "Could not produce addresses for all venues" })
//         }
//     } catch (err) {
//         return res.status(500).json({ message: err.message })
//     }   

//     res.result = result

//     next()
// }


module.exports = router 

