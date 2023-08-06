const path= require('path');
const fs= require('fs');
const {StatusCodes}=require('http-status-codes');
const CustomError= require('../errors');
const cloudinary= require('cloudinary').v2; //USE V2 


const uploadProductImageLocal= async (req,res)=>{ // This is for uploading images to the server itself

    // console.log(req.files);


    if(!req.files){ // check if file exists
        throw new CustomError.BadRequestError("No File Uploaded");
    }


    let productImage= req.files.image;  // Inside the req.files object, we are looking for 'image' property as from the front-end we are sending the file with that name. Obviously it can have any name. Checkout the line 25 of public/browser-app.js file for clarification.

    if(!productImage.mimetype.startsWith('image')){ // mimetype denotes the type of the file uploaded
        throw new CustomError.BadRequestError("Please Upload Image");
    }

    if(productImage.size>1024*1024){ //Checking for the size (The Numbers are in Bytes)
        throw new CustomError.BadRequestError("Upload image less than 1MB");
    }


    const imagePath= path.join(__dirname,'../public/uploads',productImage.name);    //Creating the absolute path to the image. productImage.name contains the name of the uploaded file. **Make sure the directory exists before moving any image to that directory**
    // console.log(imagePath);

    await productImage.mv(imagePath);   //There is a mv function provided by the file-upload package which allows to move the uploaded file elsewhere in the server. This takes the absolute path to the image and returns a promise which is to be resolved.


    res.status(StatusCodes.OK).json({image:{src:`/uploads/${productImage.name}`}});
}

const uploadProductImage=async (req,res)=>{ //This is for uploading images to cloudinary

    const result= await cloudinary.uploader.upload( //This is the method for uploading the image. It returns an object which contains a bunch of data.

    req.files.image.tempFilePath, // The tempFilePath property stores the path of the uploaded image in the temp folder which is automatically created by express-fileupload package. **This only works if useTempFiles is set to true in app.js ** 
    {
        use_filename:true,  // The original name of the uploaded file is used as its public id . Check docs for more info.
        folder:'testing-file-upload'    // The name of the folder in cloudinary. We have to create the folder in cloudinary first.
    })

    fs.unlinkSync(req.files.image.tempFilePath);        // This is to delete the temporary files . 
    res.status(StatusCodes.OK).json({image:{src:result.secure_url}})    //This secure url will be used to access the image from cloudinary
}

module.exports={uploadProductImage};


/* 
    1. For uploading an image, we should either have the image in the server or in the cloud and the created product will contain a link to the image.

    2. To access files uploaded by the user, we need to use express-fileupload package

    3. This package will make the uploaded file availabe in the req.files object.

    4. In the postman, the field name we provide while uploading the file, becomes a property of the req.files obj, inside this property all the data resides.

    5. In the frontend, as soon as we select the image file, the front-end uploads the image and gets the path, which is saved in the database later on.


    6. While using cloudinary to store images, we are using the temporary file feature provided by express-fileupload package 

    7. Basically, the idea is to parse the uploaded image and store it temporarily using express-fileupload package, till it gets uploaded to cloudinary.

    8. 
*/