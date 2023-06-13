const express = require("express");
const mongoose = require("mongoose")

require("dotenv").config({
    path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
});

const cors = require("cors")
const app = express();

app.use(cors());
app.use(express.json())

mongoose.connect(process.env.MONGO_DB, { useNewUrlParser : true })
const db = mongoose.connection //access db
db.on("error", (error) => console.log(error)) //on error print the error
db.once("open", () => console.log("Connected to db"))

const createRecordsTask = require("./tasks/hourly.js")
const deleteRecordsTask = require("./tasks/daily.js")

createRecordsTask.start()
deleteRecordsTask.start()

const venuesRouter = require("./routes/venues")
const requestsRouter = require("./routes/requests")
const filesRouter = require("./routes/files")
const timesRouter = require("./routes/times")
const recordsRouter = require("./routes/records")
const accountsRouter = require("./routes/accounts")
app.use("/venues", venuesRouter)
app.use("/requests", requestsRouter)
app.use("/files", filesRouter)
app.use("/times", timesRouter)
app.use("/records", recordsRouter)
app.use("/accounts", accountsRouter)

app.listen(process.env.PORT || 3001, () => console.log("Server started on port 3001"))
//todo remove node modules from git commits
