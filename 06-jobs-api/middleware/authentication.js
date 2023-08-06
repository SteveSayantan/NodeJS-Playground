const jwt= require('jsonwebtoken');
const { UnauthenticatedError } = require("../errors");

const authMiddleware= async(req,res,next)=>{

    //Check for header
    const authHeader= req.headers.authorization;
    if(!authHeader||!authHeader.startsWith('Bearer ')){
        throw new UnauthenticatedError("Authentication Error");
    }

    const token= authHeader.split(' ')[1];

    try {
        const payload= jwt.verify(token, process.env.JWT_SECRET);
        //Attach the user to the job routes
        req.user={userId:payload.userId,name:payload.name}
        next();
    } 
    catch (error) {
        throw new UnauthenticatedError("Authentication Invalid")
    }

}

module.exports=authMiddleware;