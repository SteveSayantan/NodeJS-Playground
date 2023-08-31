require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

const fileUpload= require('express-fileupload');


const cloudinary= require('cloudinary').v2; // USE V2 . This is the npm package for using cloudinary 

cloudinary.config({   //This is how we run the config method to setup the configuration
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
})



// database
const connectDB = require('./db/connect');

//Product Router
const productRouter= require('./routes/productRoutes');


// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');


app.use(express.static('./public')) // Making this folder public, to make the images accessible as public assets
app.use(express.json());
app.use(fileUpload({useTempFiles:true})); //This is how we invoke the file-upload package. We have to pass the argument as we are using the temporary file feature. Otherwise, there is no need to pass the argument.



app.get('/',(req,res)=>{
  res.send("<h1>File Upload Service</h1>")
})

app.use('/api/v1/products',productRouter);

// middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
