require('dotenv').config();
require('express-async-errors');

const express= require('express');
const cookieParser= require('cookie-parser') //This package parses the incoming cookies and store them in req.cookies. It is also used to sign a cookie
const cors= require('cors');
const connectDB = require('./db/connect');
const fileUpload= require('express-fileupload');

const authRouter= require('./routes/authRoutes');
const userRouter= require('./routes/userRoutes');
const productRouter= require('./routes/productRoutes');
const reviewRouter= require('./routes/reviewRoutes');
const orderRouter= require('./routes/orderRoutes');
const notFoundMiddleware= require('./middleware/not-found')
const errorHandlerMiddleware= require('./middleware/error-handler')

const app= express();
app.use(cors());
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET)); //Invoking the cookieParser. As we are sending signed cookies, we need to pass the signature string while invoking this package. Otherwise, we can go without the signature string also.
app.use(fileUpload());
app.use(express.static('./public'));


app.use('/api/v1/auth',authRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/products',productRouter);
app.use('/api/v1/reviews',reviewRouter);
app.use('/api/v1/orders',orderRouter);
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port= process.env.PORT||5000;

const start= async()=>{
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port,console.log(`Server is listening on http://localhost:${port}`))
    } 
    catch (error) {
      console.log(error);  
    }
}

start();