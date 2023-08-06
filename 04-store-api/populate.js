//This file is used to upload the product info to the database. Just run this file using node <fileName> (if you want to reupload the data to the database)

require('dotenv').config();

const ProductModel= require('./models/product');

const connectDB= require('./db/connect');

const jsonProducts= require('./products.json');

const upload= async()=>{
    try {
        await connectDB(process.env.MONGO_URI);
        await ProductModel.deleteMany(); //This deletes all the previous data (documents) stored in the database
        await ProductModel.create(jsonProducts); //This creates products (documents) in the db
        console.log("Successfully Added all data");
        process.exit(0); //If the job has been done, we need to stop the process. We provide 0 as exit code if no error occurs

    } catch (error) {
      console.log(error); 
      process.exit(1); //If any error occurs, exit with a code of 1.
    }
}

upload();