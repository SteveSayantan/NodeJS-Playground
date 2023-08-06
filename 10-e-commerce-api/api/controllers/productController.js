const Product= require('../models/Product')
const {StatusCodes}= require('http-status-codes')
const path= require('path');
const CustomError= require('../errors')


const createProduct= async (req,res)=>{
    req.body.user= req.user.userId;
    const product= await Product.create(req.body);
    res.status(StatusCodes.CREATED).json({product});
}

const getAllProducts= async (req,res)=>{
    const products= await Product.find({})
    res.status(StatusCodes.OK).json({products,count:products.length});
}

const getSingleProduct= async (req,res)=>{
    const{id:productId}=req.params;

    const product= await Product.findOne({_id:productId}).populate('reviews')   //There is no such property in the product model, basically it is a virtual property which we are adding to get the reviews for a specific product. This process is known as virtual populate. As this is a virtual property, we get all the reviews, not having the option to get a specific review. 

    if(!product){
        throw new CustomError.NotFoundError(`No product with id:${productId}`)
    }
    res.status(StatusCodes.OK).json({product});
}

const updateProduct= async (req,res)=>{
    const{id:productId}=req.params;

    const product= await Product.findOneAndUpdate({_id:productId},req.body,{runValidators:true,new:true})

    if(!product){
        throw new CustomError.NotFoundError(`No product with id:${productId}`);
    }

    res.status(StatusCodes.OK).json({product});
}


const deleteProduct= async (req,res)=>{
    const{id:productId}=req.params;
    const product= await Product.findOne({_id:productId})
    if(!product){
        throw new CustomError.NotFoundError(`No product with id:${productId}`)
    }
    //Another approach to delete a product
    await product.remove(); // remove method triggers the remove event, which deletes the reviews associated with a particular product.

    res.status(StatusCodes.OK).json({msg:"Success! Product Removed"});
}


const uploadImage= async (req,res)=>{
    if(!req.files){
        throw new CustomError.BadRequestError('No File Uploaded');
    }

    let productImage= req.files.image;  //We are looking for image property as we use 'image' as the key name while uploading images

    if(!productImage.mimetype.startsWith('image')){
        throw new CustomError.BadRequestError("Please Upload Image File");
    }

    if(productImage.size>1024*1024){
        throw new CustomError.BadRequestError("Upload Images less than 1MB in size");
    }

    const imagePath= path.join(__dirname,'../public/uploads/',productImage.name);

    await productImage.mv(imagePath);

    res.status(StatusCodes.OK).json({image:'/uploads/'+productImage.name});
}

module.exports={
    createProduct,getAllProducts,getSingleProduct,updateProduct,deleteProduct,uploadImage
}

