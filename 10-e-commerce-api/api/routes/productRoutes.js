const express= require('express')
const router= express.Router();
const{authenticateUser,authorizePermission}= require('../middleware/authentication')
const{createProduct,getAllProducts,getSingleProduct,updateProduct,deleteProduct,uploadImage}=require('../controllers/productController')
const{getSingleProductReview}= require('../controllers/reviewController')

router.route('/').get(getAllProducts).post([authenticateUser,authorizePermission('admin')],createProduct);  //We can pass the middlewares in arrays like this also

router.route('/uploadImage').post([authenticateUser,authorizePermission('admin')],uploadImage);

router.route('/:id').get(getSingleProduct).patch([authenticateUser,authorizePermission('admin')],updateProduct).delete([authenticateUser,authorizePermission('admin')],deleteProduct);  //Here this route can be placed above /uploadImage as this does not serve any post request. In that case, uploadImage will **not** be considered as a route param. 

router.route('/:id/reviews').get(getSingleProductReview);

module.exports=router;
