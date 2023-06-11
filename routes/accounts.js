const express = require("express");
const Venue = require("../models/venue");
const router = express.Router();

// Venue account info page
router.get("/:venueEmail", async (req, res) => {
    try {
        console.log(req.params.venueEmail)
        const acc = await Account.findOne({email: req.params.venueEmail})
        console.log(acc)
        if (acc == null) {
            res.status(404).json({message: "Account not found"})
        } else {
            res.status(200).json({message: acc})
        }


    } catch (err) {
        res.status(500).json({message: err})
    }
})


router.get("/:venueEmail/name", async (req, res) => {
    try {
        const acc = await Account.findOne({email: req.params.venueEmail})

        const venueName = await Venue.findById({ _id: acc.venue});

        if (acc == null) {
            res.status(404).json({message: "Account not found"})
        } else {
            res.status(200).json({venueAlias: venueName.venueAlias})
        }


    } catch (err) {
        res.status(500).json({message: err})
    }
})

// router.post("/create/:venueId", verify, async (req, res) => {

//     const venue = await Venue.findById(req.params.venueId);

//     if (!venue) {
//         return res.status(404).json({message: "Account does not exist"});
//     }
//     console.log(req.body)
//     const email = req.body.email;

//     if (!email) {
//         return res.status(401).json({message: "Insufficient body"});
//     }

//     if (!req.body.key) {
//         return res.status(401).json({message: "No key"});
//     }

//     bcrypt.hash(req.body.key, 10, async (err, hash) => {

//         if (err) {
//             res.status(500).json({message: err});
//         } else {
//             const account = new VenueAccount({venue: venue._id, email: email, key: hash});
//             await account.save();
//             return res.status(200).json({message: "Accepted"});
//         }

//     });

// });

// async function verify(req, res, next) {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//         return res.status(401).json({message: "No Auth Header"});
//     }

//     const token = authHeader.split(' ')[1];
          
//     if (token != "meeeeeeeeeeeeeee") {
//         return res.status(401).json({message: "Access denied"});
//     }

//     next();
// }

module.exports = router
