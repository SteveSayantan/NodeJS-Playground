//With the help of Schema, we are going to define the structure of the document (some data) to be stored in the collection (a group of similar data) inside the database.

const mongoose= require('mongoose');

const taskSchema= new mongoose.Schema( //Each document will have a name and a completed property (In this case). Any other properties will be ignored

   // {name:String,completed:Boolean} //This is how we can create a basic schema w/o validation. But we must add validations to our schema

   {
       name:{
           type: String,
           required: [true,"Must Provide a name"], //We can not send the data without the 'name' if the required property is set to true. For error message, pass it as a second argument in the array. Otherwise, just set the value to true
           
           //If we pass an empty string to name, it will be coerced to false. As the required property is set to true,it will throw the error

           trim:true, //Trim off the whitespaces
           maxlength: [25, "Name can not be more than 25 characters"] //We can not send the String if the length of 'name' is more than 25. For error message, pass it as a second argument in the array. Otherwise, just set the value to a number.
       },
       completed:{
           type:Boolean,
           default:false //Even if we don't pass the completed property, it is going to add that and set its value to false. Otherwise, it will override the default value.
       }
   }
)
module.exports= mongoose.model('Job',taskSchema); //Model is going to create the collection, the name of the collection is the plural (lowercased) of the name of the model, i.e., this Job model will create a collection named as jobs