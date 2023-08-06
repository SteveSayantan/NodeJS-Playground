const {CustomAPIError} = require('../errors/index')
const {StatusCodes}=require("http-status-codes")  //This package makes easier to handle different types of status codes. Checkout https://www.npmjs.com/package/http-status-codes for more details

const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Something went wrong try again later') //Instead of writing 400 ,200 we are using the values we get from package
}

module.exports = errorHandlerMiddleware
