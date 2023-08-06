//To handle 404 (sent by the controllers) separately, we are creating this custom Error class which extends the Error class

class customErr extends Error{
    constructor(msg,statusCode){
        super(msg);     //Passing the msg parameter to the parent Error class (like new Error('an error') ) to create an Error Object
        this.statusCode=statusCode;
    }
}

const createCustomErr=function(msg,status){ //This function facilitates the creation of an object of customError class 
    return new customErr(msg,status);
}

module.exports={customErr,createCustomErr}