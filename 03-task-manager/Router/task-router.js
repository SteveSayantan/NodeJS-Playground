const express= require('express');
const router= express.Router();
const{getAllTasks,createTask,getTask,updateTask,deleteTask}= require('../Controllers/taskControllerw_Wrapper')





router.route('/').get(getAllTasks).post(createTask);
router.route('/:id').get(getTask).patch(updateTask).delete(deleteTask);

module.exports= router;

/**
 * 1. Put method updates the provided properties and removes the other ones (the rest of the properties not updated by the user), i.e., restructures the entire object
 * 
 * 2. On the other hand, patch method only updates the provided properties and keeps the other ones intact. This is how the findOneAndUpdate method of mongoose works too. For details, checkout the Node tutorial (Coding Addict) around @2:24:00
 */