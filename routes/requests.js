const express = require("express")
const router = express.Router()
const Venue = require("../models/venue.js")
const Time = require("../models/times.js")
const Request = require("../models/request.js")
const bcyrpt = require("bcrypt");
const verify = require("./verify.js")

router.post("/:venueAlias", verify, async (req, res) => {
    // console.log(req.body);

    try {
        const venue = await Venue.findOne({venueAlias : req.params.venueAlias})

        if (!venue) return res.status(404).json({ message : `Venue ${req.params.venueAlias} not found`})
        
        //do date calc to see if you should accept it

        const venueId = venue._id

        const times = await Time.findOne({venue: venueId})

        if (!times) return res.status(404).json({ message : `Opening times for ${req.params.venueAlias} not found`})

        const now = new Date();
        const year = now.getUTCFullYear();
        const month = ('0' + (now.getUTCMonth() + 1)).slice(-2);
        const day = ('0' + now.getUTCDate()).slice(-2);
        const dateStr = year + '-' + month + '-' + day;
    
        const utcDay = now.getUTCDay()
        const openFrom = new Date(`${dateStr}T${times.times[utcDay].open}Z`)
        const closedFrom = new Date(`${dateStr}T${times.times[utcDay].close}Z`)


        //need to make a date, and check if its in between.

        //find day and current hour and compare
        //if openfrom is before 

        if (now < openFrom || now >= closedFrom) return res.status(403).json({ message : `Venue ${req.params.venueAlias} not open`})

        //add to count for downtime, in venue obj

        const estimate = calculateEstimate(venue, req.body.devices)
        const result = await Venue.findByIdAndUpdate(
            venueId,
            { 
                $inc: { currentTotal: estimate, requestsCount: 1 } 
            },
            {new: true}
        );

        const request = new Request({
            venue: venue._id,
            estimate: estimate
        })

        const newRequest = await request.save()
    
        res.status(201).json({ message : newRequest })

    } catch (err) {
        res.status(500).json({message: err})
    }

});

// router.get("/", async (req, res) => {
//     const reqs = await Request.find({}).sort({createdAt: -1})
//     res.status(200).json({message: reqs})
// })

// router.delete("/", async (req, res) => {
//     await Request.deleteMany({})
//     res.status(200).json({message: "Deleted all reqs"})
// })


function calculateEstimate(venue, scanned) {
    const estimate = ((scanned - (venue.numberEmployees + venue.constantDevices))/venue.customerDeviceAverage)/venue.maxCapacity * 100;

    if (estimate > 100) {
        return 100;
    } 
    return estimate > 0 ? Math.floor(estimate) : 0;
}

// Auth

router.post("/createauthkey/:_id/:authkey", async (req, res) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({message: "No Auth Header"});
    }

    const token = authHeader.split(' ')[1];
          
    if (token != "meeeeeeeeeeeeeee") {
        return res.status(401).json({message: "Access denied"});
    }

    const account = await venueAccount.findById(req.params._id);

    if (!account) {
        return res.status(401).json({message: "Account does not exist"});
    }

    bcyrpt.hash(req.params.authkey, 10, async (err, hash) => {

        if (err) {
            res.status(500).json({message: err});
        } else {
            account.key = hash;
            await account.save();
            return res.status(200).json({message: "Accepted"});
        }

    })

});


module.exports = router