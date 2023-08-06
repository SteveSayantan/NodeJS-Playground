const express= require('express')
const router= express.Router();
const{getAllJobs,getJob,createJob,editJob,deleteJob}=require('../controllers/jobs');

router.route('/').get(getAllJobs).post(createJob);
router.route('/:ID').get(getJob).patch(editJob).delete(deleteJob);

module.exports=router;