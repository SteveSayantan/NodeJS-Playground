const mongoose=require('mongoose')

const JobSchema= new mongoose.Schema({
    company:{
        type:String,
        required:[true,'Please provide company name'],
        maxlength:50
    },
    position:{   
        type:String,
        required:[true,'Please provide company name'],
        maxlength:100
    },
    status:{
        type: String,
        enum:['interview','declined','pending'],
        default:'pending'
    },
    createdBy:{
        type:mongoose.Types.ObjectId, //This will have the value of id of the user. While creating a job, we are associating it with an user who creates that job
        ref:'user', //The name of the model which provides the id, 
        required:[true,'Please provide user']
    }
},{timestamps:true}) // If it is set to true, mongoose will add createdAt and updatedAdd properties to the documents

module.exports=mongoose.model('job',JobSchema);