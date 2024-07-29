const User=require('../models/User')
const {StatusCodes}=require('http-status-codes')
const {BadRequestError, UnauthenticatedError}= require('../errors')

const register= async(req,res)=>{

    const user= await User.create(req.body) //Checking for empty values, hashing the password before saving all these have been taken care of by mongoose model

    const token= user.createJWT(); //Using mongoose instance methods to create the token instead of doing the same in the controller
    
    res.status(StatusCodes.CREATED).json({user:{name:user.name,lastName:user.lastName,location:user.location,email:user.email,token}})
}

const logIn= async(req,res)=>{
    const {email,password}=req.body;
    if(!email||!password){
        throw new BadRequestError("Please provide credentials");
    }

    const user= await User.findOne({email});
    if(!user){
        throw new UnauthenticatedError("Invalid Credentials");
    }
    //After getting the user we check for the correct password
    const isPasswordCorrect= await user.comparePassword(password);
   
    if(!isPasswordCorrect){
        throw new UnauthenticatedError("Invalid Credentials");
    }
    const token= user.createJWT();
    res.status(StatusCodes.OK).json({user:{name:user.name,lastName:user.lastName,location:user.location,email:user.email,token}})
}

const updateUser= async (req,res)=>{
    const {email,name,lastName,location}=req.body;
    if(!email||!name||!lastName||!location){
        throw new BadRequestError("Please provide all values");
    }

    const user= await User.findOne({_id:req.user.userId})

    if(!user) throw new UnauthenticatedError("Invalid Credentials")
        
    user.email=email;
    user.name=name;
    user.lastName=lastName;
    user.location=location;

    await user.save();

    const token= user.createJWT();
    res.status(StatusCodes.OK).json({user:{name:user.name,lastName:user.lastName,location:user.location,email:user.email,token}})
}

module.exports={register,logIn,updateUser}