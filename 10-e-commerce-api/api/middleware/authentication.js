const CustomError= require('../errors');
const {isTokenValid}= require('../utils');

const authenticateUser= async (req,res,next)=>{
    const token= req.signedCookies.token; //As we named our cookie as 'token'. The parsed cookie i.e. the jwt token is being stored in token.

    if(!token){
        throw new CustomError.UnauthenticatedError('Authentication Invalid');
    }
    else{
        try {
            const {name,userId,role}= isTokenValid({token});   //Decoding the jwt, we are getting the properties used to create the token
            req.user= {name,userId,role};
            next();
        } catch (error) {
            throw new CustomError.UnauthenticatedError('Authentication Invalid');
        }
        
    }
}

const authorizePermission=(...roles)=>{     //This middleware will take the roles which we want to give access to the route as args. If our application has more than two types of role i.e. admin and user, then this setup is useful

    //When this middleware will be passed with arguments to the route, it will invoke this function right away. So, we have to return a function from this middleware which will serve as a callback function to the route
    return (req,res,next)=>{

        if(!roles.includes(req.user.role)){
            throw new CustomError.UnauthorizedError('Unauthorized to Access This Route')
        }
        next();
    }
}

module.exports= {authenticateUser,authorizePermission};