const Job= require('../models/Job');
const mongoose=require('mongoose')
const {StatusCodes}=require('http-status-codes')
const{NotFoundError}=require('../errors')
const moment= require('moment')

const getAllJobs= async(req,res)=>{
    const { search, status, jobType, sort } = req.query;

    const queryObject = {
        createdBy: req.user.userId, // return the jobs that are created by current user
    };

    if(search){
        queryObject.position={$regex:search,$options:'i'};
    }

    if (status && status !== 'all') {   // In case of 'all', we need not make any changes to the queryObject
        queryObject.status = status;
    }
    if (jobType && jobType !== 'all') {
      queryObject.jobType = jobType;
    }
    let result= Job.find(queryObject);
    // sorting the data conditionally
    if (sort === 'latest') {
      result = result.sort('-createdAt');
    }
    if (sort === 'oldest') {
      result = result.sort('createdAt');
    }
    if (sort === 'a-z') {
      result = result.sort('position');
    }
    if (sort === 'z-a') {
      result = result.sort('-position');
    }

    // setting up pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);

    const jobs=await result

    const totalJobs= await Job.countDocuments(queryObject)  // This method returns the total number of jobs found based on the query object 
    const numOfPages= Math.ceil(totalJobs/limit);
    res.status(StatusCodes.OK).json({jobs,totalJobs,numOfPages});
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

const showStats=async(req,res)=>{

    let stats= await Job.aggregate([
        {
            '$match': {
                'createdBy': mongoose.Types.ObjectId(req.user.userId)   // since, req.user.userId is a string, we need to typecast it to Mongoose ObjectId
            }
        }, {
            '$group': {
                '_id': '$status', 
                'count': {
                    '$sum': 1
                }
            }
        }
    ])

    // console.log(stats);     // [ { _id: 'declined', count: 16 }, { _id: 'interview', count: 14 }, { _id: 'pending', count: 5 }]

    stats = stats.reduce((acc, curr) => {  // we apply reduce method on the received array
      const { _id: title, count } = curr;
      acc[title] = count;
      return acc;
    }, {});

    // console.log(stats);     //{ declined: 16, interview: 14, pending: 5 }
    
    // creating another object for avoiding empty values in case of new users
    const defaultStats = {
      pending: stats.pending || 0,
      interview: stats.interview || 0,
      declined: stats.declined || 0,
    };

    let monthlyApplications= await Job.aggregate([
        {
          '$match': {
            'createdBy': mongoose.Types.ObjectId(req.user.userId)
          }
        }, 
        // Ref: https://www.mongodb.com/docs/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
        {
          '$group': {
            '_id': {    // As per docs, _id can be an expression object of form { <field1>: <expression1>, ... } 
            /*
                <field> can be named anything, but <expression> have the form { <operator>: <argument> }
                in the example below, 'year' is the field, and {'$year': '$createdAt'} is <expression>
            */
              'year': {
                '$year': '$createdAt'
              }, 
              'month': {
                '$month': '$createdAt'
              }
            }, 
            'count': {
              '$sum': 1
            }
          }
        }, {
          '$sort': {
            '_id.year': -1, // since, _id is an object, we can access its fields like this
            '_id.month': -1
          }
        }, {
          '$limit': 6       // as we want to display stats for last 6 months, 
        }
    ])

    // console.log(monthlyApplications);       //[ { _id: { year: 2023, month: 9 }, count: 1 },{ _id: { year: 2023, month: 8 }, count: 2 },{ _id: { year: 2023, month: 6 }, count: 1 },...]

    // Refactoring it for frontend
    monthlyApplications= monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)       // As moment perceives month differently than mongoose
        .year(year)
        .format('MMM Y');
      return { date, count };
    })
    .reverse();         // Since we want to display the latest month at the end of the chart

    // console.log(monthlyApplications);   // [ { date: 'Jan 2023', count: 1 }, { date: 'Apr 2023', count: 1}, ...]

    res.status(StatusCodes.OK).json({defaultStats,monthlyApplications})
}

module.exports={getAllJobs,getJob,createJob,editJob,deleteJob,showStats}