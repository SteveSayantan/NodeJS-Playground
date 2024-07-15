const mongoose= require('mongoose')

const ReviewSchema= new mongoose.Schema({
    rating:{
        type:Number,
        min:1,
        max:5,
        required:[true,'Please provide rating']
    },
    title:{
        type:String,
        trim:true,
        required:[true,'Please provide review title'],
        maxlength:100
    },
    comment:{
        type:String,
        required:[true,'Please provide review text'],
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },
    product:{
        type:mongoose.Types.ObjectId,
        ref:'Product',
        required:true
    }
},{timestamps:true})

//Here, we create a compound unique-index using the user and product properties,i.e. we want to search for a Review using these two fields, and they must not store duplicate values.
// As the compound index must be unique, each user can create only one review per product.
ReviewSchema.index({user:1,product:1},{unique:true})  // we want the index entries to be stored in ascending sorted order of user and product.  
    
// However, setting the 'unique' property separately on both of these would stop a user to provide reviews for different products and storing more than one review for a product. Details: https://www.mongodb.com/docs/manual/indexes/



// All of the subsequent 'this' refers to a Review document .

ReviewSchema.statics.calculateAvgRating = async function (productId){       // Using 'statics', we attach a function to the **Model** and we can use that function with the model only.This is completely different from 'methods' which is used to attach functions to the ** instance/document ** created from model which is compiled from a schema

    const result= await this.aggregate(    // Passing the 'agg' array collected from mongo atlas in this.aggregate method. This step actually creates the aggregation pipeline. The steps perfomed in mongoDB atlas were just for collecting the 'arr' array
       [ {
            '$match': {
              'product': productId
            }
          }, {
            '$group': {
              '_id': null,      // or , we can use '$product' but the result will be the same.
              'averageRating': {
                '$avg': '$rating'
              }, 
              'numOfReviews': {
                '$sum': 1
              }
            }
          }
        ]
    )

    // console.log(result);  // Ex. [ { _id: null, averageRating: 2.25, numOfReviews: 2 } ]

    try {

        await this.model('Product').findOneAndUpdate({_id:productId}, // details about this.model() has been discussed in Product.js
            {  
            averageRating: Math.ceil(result[0]?.averageRating||0),  //If no review is available, result array will be empty. Therefore, we have to use 'optional chaining' to avoid getting errors.
            numOfReviews:result[0]?.numOfReviews||0,
        })
    } catch (error) {
        console.log(error);
    }
}


ReviewSchema.post('save', async function(){ // ** This hook is invoked after creating a new review or while using review.save() after updating some properties of a review **

    await this.model('Review').calculateAvgRating(this.product) // calling the calculateAvgRating function created on the model. It takes the product property of a Review document as an arg.
})

ReviewSchema.post('remove', async function(){ // ** This hook is invoked after deleting a review **

     await this.model('Review').calculateAvgRating(this.product)
})



/* 
    Aggregate Pipeline:

    1. It can be considered as a multi-step process where we will match documents (reviews in this case) based on some property. After that we will group the matched documents together and calculate average Rating and number of Reviews.

    2. After opening the Reviews collection in MongoDB Atlas, we click on Aggregation. After that, first we create a match ($match) stage followed by a group ($group) stage (Click on Add stage button to add stages)

    3. The code should look similar to AggregateIMG.jpg. In the match stage, the product property is hard coded intentionally. Here, we are filtering the reviews which match the product property. 

    4. In the group stage, we are grouping the reviews with same productId and calculating the average Rating and number of Reviews with the help of different operators ($sum,$avg etc.). The name of the properties( averageRating,numOfReviews ) need not to be similar to what we have in our code.  

    5. _id property in the group stage, is given null. We could have set that as '$product' too (Use the '') to group by the 'product' property. It won't make any change as all the reviews in a group , have same product property.

    6. If we had to group based on some property (e.g. rating) that may change wrt to each review of the same product, setting that property (e.g. '$rating') as _id, makes more sense. Watch the 327. additional Group id example video lecture for clarity.

    7. Click on 'Export to Language' button. Check the two boxes and copy only the 'agg' array . Now we have to set 'this.aggregate' method as shown above.

    8. For further details on pipelining and grouping , checkout https://www.mongodb.com/docs/manual/core/aggregation-pipeline/ and https://www.mongodb.com/docs/manual/reference/operator/aggregation/group/

    9. Feel free to read the docs linked above. 

    10. All these steps are performed to get the code snippet, using which we will set aggregate pipeline from our code
*/


module.exports= mongoose.model('Review',ReviewSchema);