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
        // Checking if the user is test-user
        const testUser = payload.userId === '64f5b53a6597eebaf5883b8b';
        //Attach the user to the job routes. In case of test-user, set the testUser property in req.user as true
        req.user={userId:payload.userId,testUser}
        next();
    } 
    catch (error) {
        throw new UnauthenticatedError("Authentication Invalid")
    }

}

module.exports=authMiddleware;