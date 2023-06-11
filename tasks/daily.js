const cron = require('node-cron');
const Record = require("../models/record.js");

// get requests older than a week and delete
const getWeekOldAndDelete = cron.schedule('0 0 * * *', async () => {

    console.log("Deleting stats over a week old");

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    try {

        await Record.deleteMany({ createdAt : { $lt: weekAgo } });

    } catch (err) {

        console.log("Failed to delete some records");

    }

});

module.exports = getWeekOldAndDelete;