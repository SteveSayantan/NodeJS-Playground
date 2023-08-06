const mongoose= require('mongoose');

const productSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Product name must be provided"]
    },
    price:{
        type:Number,
        required:[true,"Price must be provided"]
    },
    featured:{
        type:Boolean,
        default:false
    },
    rating:{
        type:Number,
        default:4.5
    },
    createdAt:{
        type:Date, //To store date and time, we use this
        default:Date.now() //By default, it will store the date and time when the object is created
    },
    company:{
        type:String,
        enum:{
            values:['ikea','liddy','caressa','marcos'], //The name of the company must be within these values
            message: '{VALUE} is not supported' //Custom error message,{VALUE} is the string given by user
        }

       // enum:['ikea','liddy','caressa','marcos'] //It can also be done like this if we do not want to provide custom error message
    }
})
module.exports= mongoose.model('Product',productSchema);