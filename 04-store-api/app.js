require('dotenv').config();
require('express-async-errors'); //In the previous project, we used custom async-wrapper to pass the errors to the errorHandler middleware using next. But in this one, error passing is done by express-async-errors package. We just need to call it in our app.js . In case we need to pass an error from the controller manually, we need not use the next(), just use 'throw'.

const connectDB= require('./db/connect')

const express= require('express');

const productRouter= require('./routes/products')
const notFoundMiddleware= require('./middleware/not-found')
const errorMiddleware= require('./middleware/error-handler')

const port = process.env.PORT||5500;
const app= express();


app.use('/api/v1/products',productRouter)
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const setup=async()=>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is connected to DB and Listening on http://localhost:${port}`));
    } catch (error) {
        console.log(error);
    }
}

setup();
