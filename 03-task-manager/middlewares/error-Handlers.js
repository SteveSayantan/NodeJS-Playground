//To handle the errors (e.g., 404 and 500 errors in the controllers, *not the route errors*) occured while using the app, is handled by this errorHandler. Express has a default errorHandler, but here we are creating our own


const {customErr}= require('../errors/customError');

// For 404 errors, we have created a class, checkout customError.js


const errorHandler= (err,req,res,next)=>{ //The error handler middleware takes four arguments instead of three
    console.log(err);
    if(err instanceof customErr) return res.status(err.statusCode).json({msg:err.message}) ;  //If this error is a customErr Object (for 404 error) server will send this response


    res.status(500).json({msg:'Something went wrong, please try again later'}) //Otherwise,it will send this response
}

module.exports=errorHandler;