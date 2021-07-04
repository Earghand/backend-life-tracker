const express = require("express")
const User = require("../models/user")
const { createUserJwt } = require("../utils/tokens")
const security = require("../middleware/security")
const router = express.Router()

router.post("/login", async function(req,res,next)  {
    try {
        const user = await User.login(req.body)
        const token = createUserJwt(user)
        return res.status(200).json({ user, token })
    } catch (error) {
        next(error)
    }
})

router.post("/register", async function (req,res,next) {
    try {
        console.log("trying to register")
        //take the users email, password, rsvp status
        //create a new user in our database
        const user = await User.register(req.body)
        const token = createUserJwt(user)
        return res.status(201).json({ user, token })
    } catch (error) {
        next(error);
    }
})

router.get("/me", security.requiredAuthenticatedUser, async (req,res,next) => {
    try {
        const { email } = res.locals.user
        const user = await User.fetchUserByEmail(email);
        const publicUser =await User.makePublicUser(user)
        console.log(email);
        console.log(publicUser)
        return res.status(200).json({ user: publicUser })
    } catch (error) {
        next(error);
    }
})
// router.post()

module.exports = router