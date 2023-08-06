const CustomError = require('../errors');
const { isTokenValid } = require('../utils');
const Token = require('../models/Token')
const {attachCookiesToResponse}= require('../utils')

const authenticateUser = async (req, res, next) => {
 
  const {refreshToken,accessToken}= req.signedCookies; // We will be having both cookies separately inside it.
  // console.log(req.signedCookies);

  try {
   if(accessToken){
      const payload= isTokenValid(accessToken);
      req.user= payload.user;
      return next();
   }
   const payload= isTokenValid(refreshToken); // If no refreshToken is present, it will throw error
   const existingToken = await Token.findOne({user:payload.user.userId,refreshToken:payload.refreshToken})

   if(!existingToken || !existingToken.isValid){
     throw new CustomError.UnauthenticatedError('Authentication Invalid')
   }
   attachCookiesToResponse({res,user:payload.user,refreshToken:existingToken.refreshToken}); // If refreshToken is present, send both accessToken and refreshToken cookies with the response
   req.user= payload.user;
   next();
   
  } catch (error) {
    throw new CustomError.UnauthenticatedError('Authentication Invalid');
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        'Unauthorized to access this route'
      );
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
};
