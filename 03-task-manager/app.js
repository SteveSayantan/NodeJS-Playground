const connectDB=require('./DB/connect')
const express= require('express');
const app= express();
const tasks= require('./Router/task-router');


const notFoundMiddleware= require('./middlewares/not_found-404'); //This only handles path errors
const errorHandler= require('./middlewares/error-Handlers'); //This only handles the erros encountered while using the app

require('dotenv').config(); //This is how we require dotenv. Inside the dotenv file, we need not use '' for setting up the connection string
const port= process.env.PORT||3000; //While deployed, the host may need to set the port value. To facilitate that, we need to use the PORT variable present in process.env. If no PORT variable is present (local environment), it will use 3000

// PORT=<any_value> node app.js       to see it working


//Middlewares
app.use(express.json())
app.use(express.static('./public'))

//routes
app.use('/api/v1/tasks',tasks); //This handles all the known routes

app.use(notFoundMiddleware); //(Optional) This handles any route that does not exist. It must be placed after specifying the routes. Basically, it allows to set a custom 404 message for the routes instead of the default one provided by express itself.

app.use(errorHandler); //This has to be placed at the very bottom. The errors encountered during the usage is passed to this middleware.


const setup= async ()=>{
    try {
        await connectDB(process.env.Mongo_URI);
        app.listen(port, ()=>console.log(`Server is Connected to DB & Listening on Port ${port}...`))
    } catch (error) { //In case of any error occured with the database, catch block will be executed
        console.log(error);
    }
}

setup();
