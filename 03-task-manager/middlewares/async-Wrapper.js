//This function has been created just to avoid writing try-catch block for every controller.

const asyncWrapper=(fn)=>{ // asyncwrapper takes a function as an argument and returns a function(async) to be used as controller. The returned function has try catch block inside it and executes the given function too.
    return async(req,res,next)=>{ // Like any middleware function this has access to req,res and next
        try {

            await fn(req,res,next) //passing the req,res and next to the functions (However, here all of the functions will not require the next method).
            
        } 
        catch (error) { //In case of any error with fn, catch block executes

            next(error) //If we pass any error in the next, that error will be handled by the default error handler of express. For our app, we use a dedicated error-Handler.js, i.e., the error is passed to that middleware by next method

        }
    }
}

module.exports= asyncWrapper;