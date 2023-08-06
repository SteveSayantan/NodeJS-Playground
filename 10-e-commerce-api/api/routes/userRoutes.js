const express= require('express')
const router= express.Router();
const {authenticateUser,authorizePermission}= require('../middleware/authentication')
const{getAllUsers,getSingleUser,showCurrentUser,updateUser,updateUserPassword}=require('../controllers/userController')

router.route('/').get(authenticateUser,authorizePermission('admin','owner'),getAllUsers);    //First, we want to check the if the user is valid and after that we will look for the admin or owner role. So, the order of these three middlewares must be maintained.

router.route('/showMe').get(authenticateUser,showCurrentUser)     //First with the help of authenticateUser middleware, we check for the token and create the user property in req obj. After that, we send that user details with res using showCurrentUser middleware      

router.route('/updateUser').patch(authenticateUser,updateUser)

router.route('/updateUserPassword').patch(authenticateUser,updateUserPassword)  // Using authenticateUser middleware as we want only valid users to use this route


router.route('/:id').get(authenticateUser,getSingleUser);            //  **This path with id should be placed at last. Otherwise, the rest of the routes will not work properly **

// router.route('/showMe').get(showCurrentUser)     //This gives error as here 'showMe' would be considered as a route param(id), as it is placed after /:id route and serves a get request too. 

module.exports= router;
