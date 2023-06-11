const express = require("express");
const fs = require("fs");
const path = require('path');

const router = express.Router();
const Venue = require("../models/venue");
const verify = require("./verify.js");

// Get new version of file
router.get("/venues/:venueAlias", verify, async (req, res) => {
    const file = path.join(__dirname, '..', 'files', req.params.venueAlias, "example_overwrite2.ino.bin");
    try {
        if (file == null) res.status(404);
        res.status(200).sendFile(file);
    } catch (err) {
        res.status(500).json({message : err});
    };

});

// Check file version
router.get("/venues/:venueAlias/version", verify, async (req, res) => {
    try {
        const version = await Venue.findOne({venueAlias: req.params.venueAlias}, {version : 1, _id : 0});
        res.status(200).json({version: version.version });
    } catch (err) {
        res.status(500).json({message: err});
    }

});

// Log stuff
router.post("/venues/:venueAlias/logs", verify, async (req, res) => {
    const logFile = path.join(__dirname, '..', 'files', req.params.venueAlias, "logs.txt");
    try {

        const logStream = fs.createWriteStream(logFile, { flags: 'a' });
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: 'numeric', 
            minute: 'numeric', 
            second: 'numeric',
            timeZone: 'UTC' 
        };
        logStream.write(`${new Date().toLocaleString('en-US', options)}:  ${req.body.log}` + '\n');
        res.status(200).json({message : log})

    } catch (err) {
        res.status(500)
    }

})

module.exports = router;