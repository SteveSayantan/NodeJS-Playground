const mongoose= require('mongoose');

const connectDB= (url)=>{
    return mongoose.connect(url); //This connectDB function has to return this connect method.
}
module.exports= connectDB;

//Mongoose is a object data modeling library. It has very useful methods which makes our interaction with the DB much easier.

//If the name of database is not specified in the queryString, it will create a database with the name 'test'. Otherwise, it will look for the database mentioned in the queryString and will create one if there no such database exsists.

// MongoDB Atlas Setup: https://youtu.be/rltfdjcXjmk?t=41m42s 

// ORM vs ODM : https://www.geeksforgeeks.org/comparison-between-orm-and-odm/