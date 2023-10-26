//This file is used to upload the product info to the database. Just run this file using node <fileName> (if you want to reupload the data to the database)

require('dotenv').config();

const JobModel= require('./models/Job');

const connectDB= require('./db/connect');

const jsonJobs= require('./mock_data.json');

const upload= async()=>{
    try {
        await connectDB(process.env.MONGO_URI);
        await JobModel.deleteMany(); //This deletes all the previous data (documents) stored in the database
        await JobModel.create(jsonJobs); //This creates products (documents) in the db
        console.log("Successfully Added all data");
        process.exit(0); //If the job has been done, we need to stop the process. We provide 0 as exit code if no error occurs

    } catch (error) {
      console.log(error); 
      process.exit(1); //If any error occurs, exit with a code of 1.
    }
}

upload();