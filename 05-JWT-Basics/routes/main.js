const express= require('express');
const router= express.Router();

const authMiddleware= require('../middleware/auth');
const {login,dashboard}= require('../controllers/main_w_Auth');

router.route('/dashboard').get(authMiddleware,dashboard); //As we have added the authMiddleware before the dashboard controller, each request first will go through this auth middleware and after that access dashboard
router.route('/login').post(login);

module.exports=router;