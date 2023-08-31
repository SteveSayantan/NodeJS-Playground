const User= require('../models/User');
const {StatusCodes}=require('http-status-codes');
const CustomError= require('../errors');
const { createTokenUser, attachCookiesToResponse, checkPermissions } = require('../utils');

const getAllUsers= async (req,res)=>{
    const users= await User.find({role:'user'}).select('-password')
    res.status(StatusCodes.OK).json({users});
    
}
const getSingleUser= async (req,res)=>{

    const user= await User.findOne({_id:req.params.id}).select('-password');
    if(!user){
        throw new CustomError.NotFoundError('No User Exists with id : '+req.params.id);
    }
    checkPermissions(req.user,user._id);    //Here, **user._id is of type object, not a string, checkout mongoose docs**
    res.status(StatusCodes.OK).json({user});
}

const showCurrentUser= async (req,res)=>{

    //We already have user in req obj due to authenticateUser middleware used in routes

    res.status(StatusCodes.OK).json({user:req.user});
}

const updateUserConventional= async (req,res)=>{ // Here we are going to update the user with findOneAndUpdate method

    const {email,name}= req.body;//Destructuring the req.body to restrict the user from updating other properties than these two.

    if(!email||!name){      //Checking for both email and name so that they can not be left empty by the user. 
        throw new CustomError.BadRequestError("Please provide all values");
    }
    const user= User.findOneAndUpdate({_id:req.user.userId}, {email,name}, {new:true,runValidators:true})   

    const tokenUser= createTokenUser(user); 
    attachCookiesToResponse({res,user:tokenUser});  //Sending a new token to replace the previous one

    res.status(StatusCodes.OK).json({user:tokenUser});
}

const updateUser= async (req,res)=>{ //Here we are going to update the user with user.save method

    const {email,name}= req.body;

    if(!email||!name){       
        throw new CustomError.BadRequestError("Please provide all values");
    }
    
    const user= await User.findOne({_id:req.user.userId});
    user.email=email;
    user.name=name;
    await user.save();  // ** The findOneAndUpdate method, does not invoke the pre-save hook. But here,we are triggering pre-save hook as we are invoking the save event. As a result, it will re-hash the hased password, so we need to make some modifications to the pre-save hook. ** 
    
    const tokenUser= createTokenUser(user); 
    attachCookiesToResponse({res,user:tokenUser}); 

    res.status(StatusCodes.OK).json({user:tokenUser});
}

const updateUserPassword= async (req,res)=>{
    const{oldPassword,newPassword}= req.body;
    if(!oldPassword||!newPassword){
        throw new CustomError.BadRequestError('Please provide both values');
    }
    const user= await User.findOne({_id:req.user.userId});

    const isPasswordCorrect= await user.comparePassword(oldPassword);

    if(!isPasswordCorrect){
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }

    //Updating the password in the DB (New approach, we could have also used findOneAndUpdate method)
    user.password= newPassword;
    await user.save();      //As we are invoking the 'save' event, this also triggers the 'pre'-save hook in user model, as a result this new password is hashed before storing.

    res.status(StatusCodes.OK).json({});   
}


module.exports={getAllUsers,getSingleUser,showCurrentUser,updateUser,updateUserPassword}