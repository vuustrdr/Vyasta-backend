const cron = require("node-cron")
const Request = require("../models/request.js")
const Record = require("../models/record.js");
const Venue = require("../models/venue.js");
const Time = require("../models/times.js");
const times = require("../models/times.js");

// Runs every HH = 00. //'* * * * *' //'0 * * * *'
const createRecords = cron.schedule('0 * * * *', async () => {

    console.log("Deleting requests over a day old");

    let deleted;

    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    try {
        // delete all reqs
        deleted = await Request.deleteMany({createdAt: { $lt: dayAgo }})

        console.log(deleted)

        const allVenues = await Venue.find({});

        //for all venues, need to delete current count and request count 
        allVenues.forEach(async i => {

            //pass to the next iteration if you're not within operating hours

            const now = new Date();

            // Calculate downtime
            const time = await Time.findOne({venue: i._id});

            // Find the hour range you're in - see how many hours it has in it. Make the expected the thing.
            const timesForToday = time.times[now.getUTCDay()]
            const currentHour = now.getUTCHours();

            const year = now.getUTCFullYear();
            const month = ('0' + (now.getUTCMonth() + 1)).slice(-2);
            const day = ('0' + now.getUTCDate()).slice(-2);
            const dateStr = year + '-' + month + '-' + day;
    
            const utcDay = now.getUTCDay()
        
            const openFrom = new Date(`${dateStr}T${time.times[utcDay].open}Z`)
            const closedFrom = new Date(`${dateStr}T${time.times[utcDay].close}Z`)

            // Checking if now is before opening, and checking if we are 30 past closing to allow for the last hour to come in
        
            openFrom.setMinutes(30)
            closedFrom.setMinutes(30)

            if (now < openFrom || now >= closedFrom) {
                console.log(`${i.venueAlias} is closed, or there is currently not yet enough data`)
                return
            }

            console.log(`${i.venueAlias} is within opening hours, logging...`)

            // Remove once cleaned db
            const avg = i.currentTotal/i.requestsCount

            let expected = 45;

            if (timesForToday.open.substring(0,2) == currentHour) {
                expected = expected - parseInt(timesForToday.open.substring(3,5)); 
            } else if (timesForToday.close.substring(0,2) == currentHour) {
                expected = expected - parseInt(timesForToday.close.substring(3,5));
            }

            // Save a new stat
            const record = new Record({
                venue: i._id,
                estimate: avg ? Math.floor(avg) : 0, 
                downtime: i.requestsCount < expected ? true : false
            });

            //reset
            i.requestsCount = 0;
            i.currentTotal = 0;

            //save
            const newRecord = await record.save();
            const newVenue = await i.save();

        })

    } catch (err) {
        console.log(`Error: ${err}`)
    }

});

module.exports = createRecords;