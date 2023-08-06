const jwt= require('jsonwebtoken') 
const {UnauthenticatedError}= require('../errors/index')


const authenticationMiddleware= async (req,res,next)=>{
    
    const authHeader= req.headers.authorization;            // the header name must be in smallcase
    if(!authHeader||!authHeader.startsWith('Bearer ')){
        throw new UnauthenticatedError("No token provided"); //No need to provide the status codes as they have already been taken care of.

    }

    const token= authHeader.split(" ")[1];

    try { 
        const decoded= jwt.verify(token, process.env.JWT_SECRET) //decoding the token and storing the decoded data in a variable

        const{id,username}=decoded;

        req.user={id,username};

        next();             // we must call next()
        
    } catch (error) { //If the token is invalid or expired, we throw error. This will be handled by errorHandler middleware
        throw new UnauthenticatedError("Not authorized to access this route");
    }
}

module.exports=authenticationMiddleware;