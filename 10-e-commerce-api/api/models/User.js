const mongoose= require('mongoose');

const validatorPac= require('validator'); // This package will check the validation of the email

const bcrypt= require('bcryptjs');

const UserSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please provide name'],
        minlength:3,
        maxlength:50
    },
    email:{
        type:String,
        required:[true,'Please provide email'],
        unique:true,

        validate:{ // If we do not want to use built-in validators, we can use custom validators. For more info checkout https://mongoosejs.com/docs/validation.html
            message: 'Please provide valid Email',

            validator:validatorPac.isEmail,   //This is a fuction that takes a string and checks if the string is an email. This function will execute each time we create an user
        }
    },
    password:{
        type:String,
        required:[true,'Please provide email'],
        minlength:6
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user'
    }
    
})

UserSchema.pre('save', async function(next){    // ** This hook is invoked before creating a new user or while using user.save() after updating some properties of an user **

    // console.log(this.modifiedPaths());       //Returns an array of modified properties
    // console.log(this.isModified('name'));    //Checks if the provided property is modified, returns Boolean 

    if(!this.isModified('password')) return;    //If the password is not modified, no need to execute the rest .

    const salt= await bcrypt.genSalt(10);
    const hashedPassword= await bcrypt.hash(this.password, salt);
    this.password= hashedPassword;
    
})

UserSchema.methods.comparePassword= async function(givenPassword){
    const isMatched= await bcrypt.compare(givenPassword, this.password)
    return isMatched;
}

module.exports= mongoose.model('User',UserSchema);