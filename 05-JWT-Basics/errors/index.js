const CustomAPIError = require("./custom-error") 
const BadRequest = require("./bad-request") ;
const UnauthenticatedError = require("./unauthenticated") ;


//For this project, we created three different error classes which extend from the previously created CustomAPIError Class.

//For better accessibility, we import those errors in this file, and export as an object.

module.exports={CustomAPIError,BadRequest,UnauthenticatedError}