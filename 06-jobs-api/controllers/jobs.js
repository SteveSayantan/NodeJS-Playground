const Job= require('../models/Job');
const {StatusCodes}=require('http-status-codes')
const{BadRequestError,NotFoundError}=require('../errors')

const getAllJobs= async(req,res)=>{
    const jobs= await Job.find({createdBy:req.user.userId}).sort('createdAt');
    res.status(StatusCodes.OK).json({jobs,count:jobs.length});
}

const getJob= async(req,res)=>{
    const{user:{userId},params:{ID:jobID}}=req; // Destructuring the properties and setting the alias for ID

    const job= await Job.findOne({createdBy:userId,_id:jobID}); //Checking for both userID and jobID

    if(!job){
        throw new NotFoundError(`No job with id:${jobID} exists`)
    }
    res.status(StatusCodes.OK).json({job});
}

const createJob= async(req,res)=>{
    req.body.createdBy=req.user.userId; //We have to set the createdBy property explicitly in the req.body
    const job= await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({job});
}
const editJob= async(req,res)=>{
    const{user:{userId},params:{ID:jobID}}=req;

    const job= await Job.findOneAndUpdate({createdBy:userId,_id:jobID},req.body,{new:true,runValidators:true});

    if(!job){
        throw new NotFoundError(`No job with id:${jobID} exists`);
    }
    res.status(StatusCodes.OK).json({job});
}
const deleteJob= async(req,res)=>{
    const{user:{userId},params:{ID:jobID}}=req;
    const job= await Job.findOneAndDelete({createdBy:userId,_id:jobID});
    if(!job){
        throw new NotFoundError(`No job with id:${jobID} exists`);
    }

    res.status(StatusCodes.OK).send(); //As we are only looking for 200 status code on the frontend
}

module.exports={getAllJobs,getJob,createJob,editJob,deleteJob}