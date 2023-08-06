
// We have created a separate middleware for Authorization. We implement it in this file.

const jwt= require('jsonwebtoken') 
const {BadRequest}= require('../errors/index') //We could have omitted the index, as node will assume it.

const login= async (req,res)=>{
    const {username,password}=req.body;

    if(!username||!password){
        throw new BadRequest("Please provide email and password"); 
    }

    const id= new Date().getDate(); 

    const token= jwt.sign({id,username}, process.env.JWT_SECRET,{expiresIn:'30d'}) 

    res.status(200).json({msg:'user created',token});
}


const dashboard= async (req,res)=>{

    const luckyNumber= Math.floor(Math.random()*100);

    res.status(200).json({msg:`Hello ${req.user.username}`,secret:`This is your lucky number ${luckyNumber}`});
    
    }

module.exports={login,dashboard};