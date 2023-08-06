const express= require('express')
const router= express.Router();
const{register,login,logout}=require('../controllers/authController')

router.get('/logout',logout);
router.route('/login').post(login);
router.route('/register').post(register);

module.exports= router;