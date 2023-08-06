const Product= require('../models/Product')
const Review= require('../models/Review')
const {StatusCodes}= require('http-status-codes')
const CustomError= require('../errors')
const {checkPermissions}=require('../utils')

const createReview= async (req,res)=>{
    const{product:productId}= req.body;

    const isValidProduct= await Product.findOne({_id:productId});

    if(!isValidProduct){
        throw new CustomError.NotFoundError(`No product with id:${productId}`)
    }

    const alreadySubmitted= await Review.findOne({product:productId,user:req.user.userId})

    if(alreadySubmitted){
        throw new CustomError.BadRequestError(`Already Submitted Review`)
    }

    req.body.user= req.user.userId;
    const review= await Review.create(req.body);
    res.status(StatusCodes.CREATED).json({review});

}

const getAllReviews= async (req,res)=>{

    /* 
        With the help of populate method, we can access properties of documents in other collections. Check out https://mongoosejs.com/docs/populate.html#populate

            1. 'path' takes which property (of the current document) to be populated . **This property must refer to some other model.** 

            2. 'select' takes the specific fields to be populated from other document.

            3. This only takes effect in the response we get. No changes are made to data stored in the DB.

            Here, The 'product' and 'user' properties (which already refer to some other models) of all the reviews are populated with the given fields. 
    */

    const reviews= await Review.find({}).
    populate({path:'product',select:'name company price'}).populate({path:'user',select:'name'})   // We can chain like this multiple times
    
    res.status(StatusCodes.OK).json({reviews,count:reviews.length});
}

const getSingleReview= async (req,res)=>{
    const {id:reviewId}= req.params;
    const review= await Review.findOne({_id:reviewId}).populate({path:'user',select:'name'});   //Here, the 'user' property of the review will be populated with name field.

    if(!review){
        throw new CustomError.NotFoundError(`No Review with id:${reviewId}`)
    }
    res.status(StatusCodes.OK).json({review});
}

const updateReview= async (req,res)=>{
    const {id:reviewId}= req.params;
    const {rating,title,comment}= req.body;

    const review= await Review.findOne({_id:reviewId});

    if(!review){
        throw new CustomError.NotFoundError(`No Review with id:${reviewId}`)
    }

    checkPermissions(req.user,review.user);

    review.rating=rating;
    review.title=title;
    review.comment=comment;

    await review.save(); // For triggering post-save hook in ReviewSchema

    res.status(StatusCodes.OK).json({review});
}

const deleteReview= async (req,res)=>{
    const {id:reviewId}= req.params
    const review= await Review.findOne({_id:reviewId});

    if(!review){
        throw new CustomError.NotFoundError(`No Review with id:${reviewId}`)
    }

    checkPermissions(req.user,review.user);
    await review.remove();  // For triggering post-remove hook in ReviewSchema

    res.status(StatusCodes.OK).json({msg:'Review removed successfully!'});
}

const getSingleProductReview= async(req,res)=>{     //Instead, we could have created a similar controller in the product controller importing the Review model and use that controller in product route. 

    const {id:productId}= req.params;
    const reviews = await Review.find({product:productId})

    res.status(StatusCodes.OK).json({reviews,count:reviews.length})
}

module.exports={
    createReview,getAllReviews,getSingleReview,updateReview,deleteReview,getSingleProductReview
}