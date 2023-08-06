const User= require('../models/User');
const CustomError= require('../errors')
const {StatusCodes}=require('http-status-codes')
const {attachCookiesToResponse,createTokenUser}=require('../utils');

const register= async(req,res)=>{
    //Checking for duplicate email values (if we do not want to rely on 'unique' property used in the model)
    const {email}= req.body;
    const emailAlreadyExists= await User.findOne({email});
    if(emailAlreadyExists){
        throw new CustomError('Email Already Exists')
    }

    //Creating the user

    const {name,password}= req.body;  // To stop users from creating an admin role for themselves, we will pass only these destructured properties to create an user. To elivate an user account to admin, we need to change the role in DB manually.

    const isFirstAccount= await User.countDocuments({}) // countDocuments method returns the number of documents that matches the provided filter like findOne.
    const role= isFirstAccount==0?'admin':'user';  //Setting the first user as admin

    const user= await User.create({name,email,password,role});

    // Generating the token and instead of sending jwt via response, we are sending them via cookies. 

    const tokenUser={name:user.name,userId:user._id,role:user.role};    // Using some selected properties of user to create jwt
        
    attachCookiesToResponse({res,user:tokenUser}) // This function (imported from the utils folder), generates the token and attaches it as a cookie to the response

  
    res.status(StatusCodes.CREATED).json({user:tokenUser}); 

    // ** After receiving the cookie from the backend, the browser/postman (i.e. the frontend) will send the cookie with each request automatically. So we can access that **parsed** cookie in req.cookies or req.signedCookies (In case of signed cookies). If no cookie is present, their value will be empty **
    
}


const login= async(req,res)=>{
    const {email,password}=req.body;

    if(!email||!password){
        throw CustomError.BadRequestError('Please provide Email and Password');

    }
    const user= await User.findOne({email});

    if(!user){
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }

    const isPasswordCorrect= await user.comparePassword(password);

    if(!isPasswordCorrect){
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }

    const tokenUser=createTokenUser(user);    

    attachCookiesToResponse({res,user:tokenUser})

    res.status(StatusCodes.OK).json({user:tokenUser});

}

const logout= async(req,res)=>{

    //Here we are updating the value of the previously sent cookie with a random string

    res.cookie('token','logout',{expires:new Date(Date.now()+5*1000)}); //This cookie will be expired within 5 sec. In a browser we check for that (but not in postman).
    //If we do not add the extra 5 seconds, the cookie will expire immediately after creation and an empty cookie (or no cookie) will be sent.

    res.status(StatusCodes.OK).json({msg:'Logged Out'})
}
module.exports={
    register,login,logout
}