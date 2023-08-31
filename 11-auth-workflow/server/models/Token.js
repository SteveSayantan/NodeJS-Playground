const mongoose= require('mongoose')

const TokenSchema= new mongoose.Schema({
    refreshToken:{type:String,required:true},
    ip:{type:String,required:true},  // IP Address of the user   
    userAgent:{type:String,required:true}, // device of the user 
    isValid:{type:Boolean,default:true},    // this property is created to block some users from accessing the application
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true

    }
},{timestamps:true})


module.exports= mongoose.model('Token',TokenSchema);