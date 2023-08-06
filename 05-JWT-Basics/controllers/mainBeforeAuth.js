// JWT  is a digitally signed secured token used while exchanging data between two parties e.g. server and front-end

//It has three main parts : header, payload (This contains some data like userid, username etc.) , signature . For more details, checkout https://jwt.io/introduction & https://www.npmjs.com/package/jsonwebtoken

//The main idea is when the user provides the username and id, we create a token for that user and send it to the front-end. When the user makes any get request (with valid token) to the server, we decode the token and get the userid or username according to which, the server sends back the data that belongs to that username or userid. 

const jwt= require('jsonwebtoken') //To sign and decode jwt, we are using this package
const CustomError= require('../errors/custom-error')

const login= async (req,res)=>{
    const {username,password}=req.body;

    if(!username||!password){
        throw new CustomError("Please provide email and password",400); // we have to use "throw" for passing an error to the async-error handler function which will pass it to the errorhandler middleware.
    }

    const id= new Date().getDate(); //Just for this tutorial. Generally, this id is provided by the DB

    const token= jwt.sign({id,username}, process.env.JWT_SECRET,{expiresIn:'30d'}) //To create the token for a user, we are using username and id. This second parameter is a string value which has to be kept confidential and is defined at .env file

    res.status(200).json({msg:'user created',token});
}


const dashboard= async (req,res)=>{
    //To be authorized, all the requests must contain this header (it contains a string) -->  Authorization : "Bearer <token>" (Check the front-end code to know how to set this header)
    // console.log(req.headers);

    const authHeader= req.headers.authorization;
    if(!authHeader||!authHeader.startsWith('Bearer ')){
        throw new CustomError("No token provided",401); 

    }

    const token= authHeader.split(" ")[1];

    try { //We need to decode the token using try-catch block
        const decoded= jwt.verify(token, process.env.JWT_SECRET) //decoding the token and storing the decoded data in a variable

        const luckyNumber= Math.floor(Math.random()*100);

        res.status(200).json({msg:`Hello ${decoded.username}`,secret:`This is your lucky number ${luckyNumber}`});
        
    } catch (error) { //If the token is invalid or expired, we throw error
        throw new CustomError("Not authorized to access this route",401);
    }

}

module.exports={login,dashboard};