require('dotenv').config();
require('express-async-errors');

// extra security packages

const helmet=require('helmet');   
const cors= require('cors');
const xss= require('xss-clean');
const rateLimiter=require('express-rate-limit')


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

// extra packages
app.use(express.json());
app.use(express.static('./public'))


// Invoking the security packages

app.set('trust proxy', 1)      // As per the express-rate-limit docs, this line is necessary if we host our app
app.use(rateLimiter({         // This is copied from express-rate-limit docs
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100,               // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}));
app.use(helmet());
app.use(cors());
app.use(xss());


// routes
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/jobs',authMiddleware,jobsRouter); //As we have to protect all the job routes, we add the authMiddleware before the router middleware, instead of adding the authMiddleware before each route.
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
  Some Details about the security packages:

  1. Helmet sets various http headers to prevent numerous possible attacks

  2. CORS ensures the accessibility of our api from different domain. CORS (Cross Origin Resource Sharing) is a HTTP-header based mechanism to allow or restrict requested resources on a web server depending on where the http-request was initiated. Without this, we can only access our api from the same domain where it is hosted. Check out https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

  3. xss-clean sanitizes the user input in req.body , req.query and req.params to protect us from cross-side scripting attacks performed by injecting malicious code
  
  4. express-rate-limit limits amount of requests user can make in a given time period.

*/