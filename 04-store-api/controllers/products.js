const productModel= require('../models/product');

const getAllProductsStatic= async (req,res)=>{
    const products= await productModel.find({}).sort('-name ')
    res.status(200).json({products,nbHits:products.length});
}

const getAllProducts= async (req,res)=>{
    const{name,featured,company,sort,fields,numericFilters}=req.query; //Destructuring the properties from req.query object, so that we only have to deal with these properties, any other property entered by the user will not be entertained

    // As we are using multiple filters here, we have to make an object that contains all the desired filters
    const queryObject={};

    if(name){
        queryObject.name={$regex:name,$options:'i'}; //Using the name provided by the user as a regEx pattern. It will return the entire document (product) which has a name property that matches the given regEx. i used for case insensitivity. 
    } //If we do not use regEx, the user has to provide the exact name of the product,otherwise no product is returned. The use of regEx solves this issue.
    
    if(company){
        queryObject.company=company;
    }
    if(featured){
        queryObject.featured= featured=='true'? true:false;
    }

    //To filter the data w.r.t numeric values (Ex. /api/v1/products?numericFilters=price>40 shows items worth greater than 40)

    if(numericFilters){
        const OperatorMaps={ //Mongoose uses $gt,$lt etc. for such operation. These have to be provided to the filter/query object, inside find method.
            '>':'$gt',
            '<':'$lt',
            '>=':'$gte',
            '<=':'$lte',
            '=':'$eq',
        }

        const regEx= /\b(<|>|>=|<=|=)\b/g; // Without these \b characters, it will return only the first character matched (e.g., > is returned in case of >=)
        
        //replacing the >,<,>= etc. provided in the query with $gt,$lt etc. These '-' are added for convenience.
        let filters= numericFilters.replace(regEx,(match)=>`-${OperatorMaps[match]}-`) //replace method takes a callback function, which takes the match as an argument.
       
        const options= ['price','rating'];

        
        filters.split(',').forEach(ele => { //Splitting the string 
        const [field,operator,value]=ele.split('-'); //Again splitting each part based on '-', and destructuring the returned array.
        

        if(options.includes(field)){
            queryObject[field]={[operator]:Number(value)} //Dynamically setting the properties and the object
        }
        });

        
    }

    console.log(queryObject);
    let result= productModel.find(queryObject); //This returns a queryObject

    //Sorting ( Ex. /api/v1/products?sort=name,-price sorts the products w.r.t names in ascending order and price in descending order)

    //For sorting we need to chain the sort method after find method, as sorting just changes the order of the results

    if(sort){ 
       const sortList= sort.split(',').join(' '); //To rearrange the string provided in sort
       result=result.sort(sortList);
    }
    else{ //If user does not pass any sort query, products will be sorted acc. to date of creation
        result=result.sort("createdAt")
    }

    //Select Method (To choose which fields to be displayed. Ex./api/v1/products?fields=name,price,rating displays only the name,price and rating of all the products)

    //For using the select method we need to chain the select method after sort method

    if(fields){
        const fieldList= fields.split(',').join(' ');
        result= result.select(fieldList);
    }

    //Pagination Functionality (To limit the number of products appearing and split them into several pages)

    const page= Number(req.query.page)||1; //If no page is provided with the query or invalid page number, the value will be 1
    const limit= Number(req.query.limit)||10;
    const skip= (page-1)*limit;

    result= result.limit(limit).skip(skip);

    const products= await result; //This returns the list of products

    res.status(200).json({products,nbHits:products.length});
}

module.exports={getAllProducts,getAllProductsStatic}

//For further details about the use of regEx in MongoDB: https://www.mongodb.com/docs/manual/reference/operator/query/regex/

//Check out the https://youtu.be/rltfdjcXjmk?t=13896 (Coding Addict) to solve any doubt related to any functionality or structure of the program. 