const User = require('../models/User');
const Token = require('../models/Token');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResponse, createTokenUser,sendVerificationEmail,sendResetPasswordEmail,createHash } = require('../utils');
const crypto = require('crypto')    // This in-built package is used to generate unique token (a Bigg String) for each user.




const register = async (req, res) => {
  const { email, name, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists');
  }

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'user';

  const verificationToken=crypto.randomBytes(40).toString('hex') // This will create 40 random bytes and turn it into a string which will be hex encoded.


  const user = await User.create({ name, email, password, role,verificationToken });

  const origin='http://localhost:3000' // As we have our frontend at 3000 port. For production, we will set the value of origin to our server url.


/* 
    Some Important Info about the Front-End and the Origin

    1. The request (that comes from the frontend, not from Postman) contains handful of important properties in 'headers' object. We can access those properties using get method:
    
      a. req.get('origin')      // From where the request was originated. As we are using 'proxy' in our frontEnd that makes the request, this will show localhost:5000 in this case.

      b. req.get('protocol')    // The protocol of the request (i.e. http or https)

      c. req.get('host')        // URL of the server

      d. req.get('x-forwarded-host')    // The original frontend url (without the proxy)

      e. req.get('x-forwarded-proto')   // The original protocol used by the frontend (without the proxy). 

      e. req.headers['user-agent']   // (This is another way to access a header property) The device used to make the request 
*/

  await sendVerificationEmail({name:user.name,email:user.email,verificationToken:user.verificationToken,origin});

  res.status(StatusCodes.CREATED).json({msg:'Success! Please check your email to verify account'})
  
};


const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password');
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  if(!user.verified){ // In this step, we check if the user has verified his email.
    throw new CustomError.UnauthenticatedError('Please Verify your Email');

  }
  const tokenUser = createTokenUser(user);

  //create refresh token
  let refreshToken='';

  // check for existing token
  const existingToken= await Token.findOne({user:user._id});

  if(existingToken){
    const{isValid}= existingToken;
    if(!isValid){
      throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }

    refreshToken= existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser,refreshToken });
    return res.status(StatusCodes.OK).json({ user: tokenUser });
  }


  refreshToken= crypto.randomBytes(40).toString('hex');
  const userAgent= req.headers['user-agent']; // Getting the value of 'user-agent' header
  const ip= req.ip;   // Getting the value of ip property from req object
  const userToken= {refreshToken,ip,userAgent,user:user._id};
  await Token.create(userToken);

  attachCookiesToResponse({ res, user: tokenUser,refreshToken });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {

  await Token.findOneAndDelete({user:req.user.userId});   // Deleting the Token Document associated with the user.

  res.cookie('accessToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.cookie('refreshToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

const verifyEmail=async (req,res)=>{
  const{verificationToken,email}=req.body;
  const user= await User.findOne({email});
  if(!user){
    throw new CustomError.UnauthenticatedError("Verification Failed");
  }
  if(user.verificationToken!==verificationToken){
    throw new CustomError.UnauthenticatedError("Verification Failed");
  }

  user.isVerified=true;
  user.verified=Date.now();
  user.verificationToken=''; // Once verified , set the value of verification token to an empty string.

  await user.save();

  res.status(StatusCodes.OK).json({msg:"Email Verified"});
}

const forgotPassword= async(req,res)=>{
  const {email}=req.body;
  if (!email) {
    throw new CustomError.BadRequestError('Please provide valid email');
  }
  const user = await User.findOne({ email });

  if(user){
    const passwordToken= crypto.randomBytes(70).toString('hex')
    const origin='http://localhost:3000'
    // send email
    await sendResetPasswordEmail({name:user.name,email:user.email,token:passwordToken,origin})  

    const tenMinutes= 1000*60*10;
    const passwordTokenExpirationDate= new Date(Date.now()+tenMinutes); 

    user.passwordToken= createHash(passwordToken);    // Hash before saving to the DB
    user.passwordTokenExpirationDate= passwordTokenExpirationDate;

    await user.save();
  }
  res.status(StatusCodes.OK).json({msg:'Please check your email for reset password link'});   // Even if no user is found, we send 200 status code to confuse some possible attacker
}

const resetPassword= async(req,res)=>{
  const {token,email,password}= req.body;

  if (!token||!email||!password) {
    throw new CustomError.BadRequestError('Pleaser provide all values');
  }

  const user = await User.findOne({ email }); 

  if(user){
    const currentDate= new Date();

    // Hash the incoming password before compairing, as the one in DB is already hashed
    if(user.passwordToken==createHash(token) && user.passwordTokenExpirationDate>currentDate){   // Compairing two dates
      user.password= password;
      user.passwordToken= null;
      user.passwordTokenExpirationDate= null;
      await user.save();
    }
  }
  res.status(StatusCodes.OK).json({msg:'Password Reset was successful'}); // Even if no user is found and no password is reset, we send 200 status code to confuse some possible attacker
}

/* 
  1. In the E-commerce Project, we had been sending cookies right after registration.

  2. But, here, after registering we send a token via the link provided in the verification email and the user has to send  the token again to get his email verified. Once verified, the user can log in using the login route and get his token to access the protected routes.

  3. There are two types of tokens i.e. AccessToken and RefreshToken used in this project. The former has less expiration time (e.g. one day) than the latter (e.g. thirty days). 

  4. After verification of Email, when the user logs in for the first time, both of the token are sent as cookies.

  5. If the accessToken expires but the refreshToken is active, the authenticateUser middleware will attach both of them as cookies to the response each time.

  6. But if the refreshToken expires, the user has to login.

  7. Whenever the user opens the frontend, it makes a request to the showMe route and both of the tokens are renewed, therefore the chances of sudden expiration of cookies are less

  8. Setup the frontend and update the nodemailerConfig to register new user.

  9. In the Forgot Password functionality, we send a token via the link provided in the email. We store the token in DB
  
  10. While Resetting the Password, we compare the token in request obj and the token stored in DB. If everything goes correct, we update the password. 


*/

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,resetPassword
};


