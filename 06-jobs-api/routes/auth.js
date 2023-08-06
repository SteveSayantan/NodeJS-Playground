const express= require('express');
const { logIn, register } = require('../controllers/auth');
const Router= express.Router();

Router.post('/login',logIn)
Router.post('/register',register)

module.exports=Router;