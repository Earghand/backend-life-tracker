const express = require("express");
const Sleep = require("../models/sleep");
const router = express.Router()
const security = require("../middleware/security")


router.post("/", security.requiredAuthenticatedUser, async function(req,res,next)  {
    try {
        // Create a new sleep handler
        console.log("PSPAOPFOPEKPFGOEOPFGEIOPFGOPEFGKEOPGEOPFGKOP")
        const { user } = res.locals
        const sleep = await Sleep.createNewSleep( {user, post: req.body } )
        return res.status(201).json({ sleep })
    } catch (error) {
        next(error)
    }
})


router.get("/", async function(req,res,next)  {
    try {
        const sleeps = await Sleep.listSleeps();
        console.log("finding")
        return res.status(200).json({ sleeps })
    } catch (error) {
        next(error)
    }
})


router.get("/:sleepId", async function(req,res,next)  {
    try {
        // Fetch single id for sleep
        const { sleepId } = req.params
        const sleep = await Sleep.fetchSleepById(sleepId) 
        return res.status(200).json({ sleep })
    } catch (error) {
        next(error)
    }
})


// router.post()

module.exports = router