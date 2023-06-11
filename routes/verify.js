const Venue = require("../models/venue.js")
const VenueAccount = require("../models/venueAccount.js")
const bcyrpt = require("bcrypt");

async function verify(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({message: "No Auth Header"});
        }

        const token = authHeader.split(' ')[1];
        const venue = await Venue.findOne({ venueAlias : req.params.venueAlias });

        if (!venue) {
            return res.status(404).json({message: "Not found"})
        }

        const account = await VenueAccount.findOne({ venue: venue._id });

        bcyrpt.compare(token, account.key, (err, result) => {
            if (err) {
              res.status(500).json({message: err});
            } else {
              if (result) {
                next();
              } else {
                res.status(401).json({message: "Unauthorized"});
              }
            }
        });


    } catch (err) {
        res.status(500).json({message: err})
    }
}

module.exports = verify;