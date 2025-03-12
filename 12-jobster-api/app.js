require('dotenv').config();
require('express-async-errors');

const path=require('path')

// extra security packages
const helmet=require('helmet');
const xss= require('xss-clean');


const express = require('express');
const app = express();

//Routers
const authRouter= require('./routes/auth');
const jobsRouter= require('./routes/jobs');

//Authentication Middleware
const authMiddleware= require('./middleware/authentication')
//DataBase
const connectDB= require('./db/connect')
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handlerw_customError');

app.set('trust proxy', 1);

// extra packages
app.use(express.json());
app.use(express.static('./dist'))   // Serving the content of dist/ as public


// Invoking the security packages
app.use(helmet());
app.use(xss());


// routes
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/jobs',authMiddleware,jobsRouter); //As we have to protect all the job routes, we add the authMiddleware before the router middleware, instead of adding the authMiddleware before each route.


app.get('*',(req,res)=>{
  res.sendFile(path.resolve(__dirname,'dist/','./index.html'))
})


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();

/* 
  1. dist/ contains the build version of NiceJob.

  2. We want to host the frontend from the same domain, hence the content of dist/ is served as public.
  
  3. Now, we have to serve the requests that come to the api, as well as the ones that come to our frontend.

  4. We achieve that by allowing our frontend to accept all the 'GET' requests (even the invalid ones) that do not go to the api routes.

      From backend, whenever we serve static files that are linked internally, there is a chance of getting not-found error while refreshing the page.
       Suppose, we are on the 'about' page of our front-end app (say, localhost:3000/about ) that is statically served using node. Now, if we hit the refresh,
       we get a NotFound Error as the server makes a GET req to `localhost:3000/about` which does not exist in the backend.

    Using this trick, we can avoid it also.

  5. But if no suitable route is found for serving a request (except 'GET' ), the request is handled by notfoundmiddleware finally.
*/