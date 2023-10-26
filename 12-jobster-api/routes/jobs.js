const express= require('express')
const router= express.Router();
const{getAllJobs,getJob,createJob,editJob,deleteJob, showStats}=require('../controllers/jobs');
const testUser = require('../middleware/testUser');

router.route('/').get(getAllJobs).post(testUser,createJob);
router.route('/stats').get(showStats);
router.route('/:ID').get(getJob).patch(testUser,editJob).delete(testUser,deleteJob);

module.exports=router;