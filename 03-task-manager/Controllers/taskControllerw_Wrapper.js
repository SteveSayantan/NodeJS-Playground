//To reuse the try-catch block, we are using this wrapper function, so that we don't have to write try and catch for every controller

const asyncWrapper= require('../middlewares/async-Wrapper');
const taskModel= require('../Models/task-Models')
const {createCustomErr}= require('../errors/customError');

const getAllTasks= asyncWrapper(async (req,res)=>{

    const allTasks= await taskModel.find({}) //Find method helps to find the document. We have to pass some arguments as properties, but if we pass an empty object, it will return all the documents.
    res.status(200).json({tasks:allTasks});
   
})

const createTask= asyncWrapper(async (req,res)=>{
    
    const task= await taskModel.create(req.body) //This create method creates a new document in the database.Instead of req.body we could have passed an object (or an array of objects) like {name:'playboy69',role:'dev'}
    res.status(201).json({task}); //task holds the resolved part of the promise returned by create method. It consists of the data sent to db with some extra properties added by db 

}) 

//The 500 errors are now handled by the errorhandler middleware and the asyncWrapper function

const getTask= asyncWrapper( async (req,res,next)=>{
    
    const {id:taskID}= req.params; //Setting a different name for the id we get from req.params
    const task= await taskModel.findOne({_id:taskID}) //It is going to return an object which has its _id same as the provided taskID
    
    if(!task) return next(createCustomErr(`No task with id: ${taskID}`,404)); //If we don't find any task it returns null. The next method is called to pass the error to the error handler i.e., error-Handle.js

    res.status(200).json({task}); //This will send an object which has a property task which holds the value of the 'task' variable
    
})

const deleteTask= asyncWrapper( async (req,res,next)=>{
    
    const {id:taskID}= req.params; 
    const task= await taskModel.findOneAndDelete({_id:taskID}) //It is going to find and delete the document which has its _id same as the provided taskID and return the deleted object/document.
    
    if(!task) return next(createCustomErr(`No task with id: ${taskID}`,404)); //If we don't find any task it returns null  
    res.status(200).json({task}); 
    
    //res.status(200).json({task:null,status:'success'}) //As we do not perform any activity with the deleted task and we will look only for the 200 status code, we might wish not to send the deleted task back
    
})

const updateTask= asyncWrapper(async (req,res,next)=>{
    
    const {id:taskID}= req.params;
    const task= await taskModel.findOneAndUpdate({_id:taskID},req.body,//It is going to find the task having _id the same as the provided one. It also updates the properties of existing task/object with the properties of the object provided as the second argument i.e., req.body and the rest of the properites(not updated by the user,if any) remains intact.(It contains the updations from the user)
        { //This object is the third parameter of the findOneAndUpdate method
            new:true,     //If new is set to true, it will return the updated task. Otherwise, it will send the previous version of the object
            runValidators:true //The validators we had set during the schema creation, will execute if we have this property set to true      
        }) 
    
    if(!task) return next(createCustomErr(`No task with id: ${taskID}`,404)); //If no task is found with the ID provided, it returns null
    res.status(200).json({task});
    
})

module.exports={
    getAllTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask
}