const CustomAPIError= require('./custom-error');
const {StatusCodes}= require('http-status-codes');  //This package makes easier to handle different types of status codes. Checkout https://www.npmjs.com/package/http-status-codes for more details

class BadRequest extends CustomAPIError {
    constructor(message) {
      super(message)
      this.statusCode= StatusCodes.BAD_REQUEST; //Instead of writing 400 ,200 we are using the values we get from package
    }
  }
  
module.exports = BadRequest