/* 
 Here we handle three types of Mongoose Errors: (Checkout https://mongoosejs.com/docs/api/error.html#Error.prototype.name)

 1. Duplicate Error (When user tries to register an email already there)

 2. Validation Error (Where user does not provide name or password or both while registration)

 3. Cast Error (Where user provides a jobID having wrong syntax etc.)

*/
const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);

  let customError={
      //set defaults
      statusCode:err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      msg:err.message || 'Something went wrong, try again later'
  }

 //Here as we are setting the customError object, we do not need customAPI Error class
    

if(err.code&&err.code==11000){ // The error thrown by mongoose for duplicate value has a 'code' property which has a value of 11000

    customError.msg= `Duplicate value entered for ${Object.keys(err.keyValue)}`; //Object.key(name_of_obj) returns an array containing the keys of the given object. Here we are getting a single value
    customError.statusCode=400; //Updating the default values
}


if(err.name=="ValidationError"){ //In case of Validation Error, the err has a name property. For further clarification, print the particular error in console.

    customError.msg= //Object.values(obj_name) returns an array containing the values of the object
    Object.values(err.errors) //In err there is an error property which contains the fields (name,password,email)
    .map((item)=>item.message) //Each of these fields contain a message property
    .join(',')

    customError.statusCode=400;

}


if(err.name=="CastError"){ //In case of Cast Error, the err has a name property. It also contains a value property which contains the wrong value provided by the user
    customError.statusCode=404;
    customError.msg=`No item found with id:${err.value}`;
}

//   return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({ msg:customError.msg })
}

module.exports = errorHandlerMiddleware
