const mongoose=require('mongoose')
const bcrypt= require('bcryptjs');
const jwt= require('jsonwebtoken')

const UserSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please provide the name of the User'],
        maxLength:50, //Refer to the https://mongoosejs.com/docs/validation.html for more such built in validators
        minLength:4

    },
    email:{
        type:String,
        required:[true,'Please provide email'],
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'Please provide valid email'
        ], //match takes a regular expression, and throws the error if no match found

        unique:true //This property stops creation of another user with an email which is already used, this in turn prevents registered users to register again. 
        //But it is not a mongoose validator, check the docs for more info
    },
    password:{
        type:String,
        required:[true,'Please provide the password'],
        minLength:8

    }
})

//Refer to https://mongoosejs.com/docs/middleware.html#pre for any query

UserSchema.pre('save', async function(next){ //This pre method is a middleware function, with the help of which we can do some work before saving (creating) the created user. As it is a middleware, it takes next method as an argument

    const salt= await bcrypt.genSalt(10); //This method generates random bytes which is used to hash our password. In this case, it will generate 10 random bytes. Giving a large value will consume a lot of processing power
    const hashedPassword= await bcrypt.hash(this.password, salt); //This creates our hased password, it takes two args. Once anything is hashed, it can not be reverted to its original form

    this.password= hashedPassword; //As we are using this keyword, it is necessary to use traditional functions

    // next(); //As we are using async function we need not to call the next method (as per the docs)
})




//Every user created by this schema, can have its own built-in instance methods. For reference checkout https://mongoosejs.com/docs/guide.html#methods
UserSchema.methods.createJWT=function() { //createJWT is a custom method of user created from this schema. Here, we don't need async functions.


    //As we are using this keyword, use traditional function

    return jwt.sign({userId:this._id,name:this.name},process.env.JWT_SECRET,{expiresIn:'30d'}) // Read about this expiresIn option at https://www.npmjs.com/package/jsonwebtoken

 //Here this refers to the user created from this schema
}


UserSchema.methods.comparePassword= async function(givenPassword){ //We can also set instance methods as async function

   const isMatched= await bcrypt.compare(givenPassword, this.password); // compare method compares two passwords, returns a promise which resolves to true if match found or false otherwise.
   return isMatched; //true or false
}

module.exports=mongoose.model('user',UserSchema);