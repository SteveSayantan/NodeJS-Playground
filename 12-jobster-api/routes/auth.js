const authMiddleware =require('../middleware/authentication')
const express= require('express');
const { logIn, register, updateUser } = require('../controllers/auth');
const testUser = require('../middleware/testUser');
const rateLimiter=require('express-rate-limit')
const Router= express.Router();

const apiLimiter= rateLimiter({
    windowMs:15*60*1000, // Within 15 minutes per window
    max:10,     // 10 requests are allowed at max

    message:{   // Here, the message property is an object because the frontend is designed to accept an object. We can use string as well.
        msg:"Too many request from this IP, please try again after 15 minutes"
    }
})
Router.post('/login',apiLimiter,logIn)  // We shall add the apiLimiter before the logIn and Register route
Router.post('/register',apiLimiter,register)
Router.patch('/updateUser',authMiddleware,testUser,updateUser)

module.exports=Router;