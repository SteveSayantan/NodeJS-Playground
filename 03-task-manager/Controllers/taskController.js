const taskModel= require('../Models/task-Models')

const getAllTasks= async (req,res)=>{
    try {
        const allTasks= await taskModel.find({}) //Find method helps to find the document. We have to pass some arguments as properties, but if we pass an empty object, it will return all the documents.
        res.status(200).json({tasks:allTasks});
    } catch (error) {
        res.status(500).json({msg:error})
    }
}

const createTask= async (req,res)=>{
    try {
        const task= await taskModel.create(req.body) //This create method creates a new document in the database.Instead of req.body we could have passed an object like {name:'playboy69',role:'dev'} or an array of such objects
        res.status(201).json({task}); //task holds the resolved part of the promise returned by create method. It consists of the data sent to db with some extra properties added by db
        
    } catch (error) {
      res.status(500).json({msg:error})  
    }
} 

const getTask= async (req,res)=>{
    try{
        const {id:taskID}= req.params; //Setting a different name for the id we get from req.params
        const task= await taskModel.findOne({_id:taskID}) //It is going to return an object which has its _id same as the provided taskID
        
        if(!task) return res.status(404).json({msg:`No task with id: ${taskID}`}) //If we don't find any task it returns null
        res.status(200).json({task}); //This will send an object which has a property task which holds the value of the 'task' variable
    }
    catch(error){
        res.status(500).json({msg:error})  //If the provided ID does not have expected amount of characters or some other flaws
    }
}

const deleteTask= async (req,res)=>{
    try {
        const {id:taskID}= req.params; 
        const task= await taskModel.findOneAndDelete({_id:taskID}) //It is going to find and delete the document which has its _id same as the provided taskID and return the deleted object/document.
        
        if(!task) return res.status(404).json({msg:`No task with id: ${taskID}`}) //If we don't find any task it returns null  
        res.status(200).json({task}); 
        
        //res.status(200).json({task:null,status:'success'}) //As we do not perform any activity with the deleted task and we will look only for the 200 status code, we might wish not to send the deleted task back
    }
    catch(error){
        res.status(500).json({msg:error}) 
    }
}

const updateTask= async (req,res)=>{
    try {
        const {id:taskID}= req.params;
        const task= await taskModel.findOneAndUpdate({_id:taskID},req.body,//It is going to find the task having _id the same as the provided one. It also updates the properties of existing task/object with the properties of the object provided as the second argument i.e., req.body and the rest of the properites(not updated by the user,if any) remains intact.(It contains the updations from the user)
            { //This object is the third parameter of the findOneAndUpdate method

                new:true,     //If new is set to true, it will return the updated task. Otherwise, it will send the previous version of the object
                runValidators:true, //The validators we had set during the schema creation, will execute if we have this property set to true      

                // Checkout the 'overwrite' property (@ 2:23:00) which can be used to modify the document structure
            }) 
       
        if(!task) return res.status(404).json({msg:`No task with id: ${taskID}`}) //If no task is found with the ID provided, it returns null
        res.status(200).json({task});
    } 
    catch (error) {
        res.status(500).json({msg:error}) 
    }
}
module.exports={
    getAllTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask
}