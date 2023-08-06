const mongoose= require('mongoose');
const ProductSchema= new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true,'Please provide Product Name'],
        maxlength:[100,'Name can not be more than 100 character']
    },
    price:{
        type:Number,
        required:[true,'Please provide Product Price'],
        default:0
    },
    description:{
        type:String,
        required:[true,'Please provide Product Description'],
        maxlength:[1000,'Description can not be more than 1000 characters']

    },
    image:{
        type:String,
        default:'/uploads/jpeg'
    },
    category:{
        type:String,
        required:[true,'Please provide Product Category'],
        enum:['office','kitchen','bedroom']
    },
    company:{
        type:String,
        required:[true,'Please provide Product Company'],
        enum:{
            values:['ikea','liddy','marcos'],
            message:'{VALUE} is not supported'
        }
    },
    colors:{
        type:[String],   //It is an array containing strings. 
        default:['#222',],  //By default, it is going to be set as an empty array. To prevent that, we provide some values
        required:true
    },
    featured:{
        type:Boolean,
        default:false
    },
    freeShipping:{
        type:Boolean,
        default:false
    },
    inventory:{
        type:Number,
        required:true,
        default:15
    },
    averageRating:{
        type:Number,
        default:0
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true,"Please provide User"]
    }



},{timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}})    //To enable the virtual populating, we need to pass these properties.


ProductSchema.virtual('reviews',{   // 'reviews' is the name of the virtual property. This name should be the same in productController @ line 21
   
    ref:'Review',   // Refer to the Review model

    //Find such reviews where
    localField:'_id',        // _id property of this product model 
    //matches with
    foreignField:'product', // product property of review model. So that, we get reviews corresponding to that particular product.

        /* 
            1. localField refers to the property ( _id ) which is associated with the model (Product) in which virtuals is being set .

            2. foreignField refers to the property (product) which is associated with the model (Review) which provides the values to be populated .
        
        */

    justOne:false,            //To get the entire list of reviews for a particular product

    // match:{rating:5}         // (un-comment if needed) shows only the reviews that have rating 5 
})

/* 
    Why do we need to populate virtual properties?

    There could be innumerable reviews for a single product. If we want each product to store those reviews, it will create performance issues. Instead, we have designed our review model to store their user, but user model should not store all reviews. We will populate reviews virtually.

    For details https://mongoosejs.com/docs/populate.html#populate-virtuals

    Alternative approach, create a controller in the review controller to get a single review, and create a separate route in the product route to get reviews about a single product. In this approach, unlike the previous one, we get to query the reviews as per our needs.
*/


// When a product is deleted, the reviews associated with it should be deleted too

ProductSchema.pre('remove', async function(next){   // This hook listens for remove event for each product

    await this.model('Review').deleteMany({product:this._id}); //Using this.model we can access other models too (from a model). Delete the reviews which contain 'product' property equal to _id of product being deleted.
})


module.exports= mongoose.model('Product',ProductSchema);