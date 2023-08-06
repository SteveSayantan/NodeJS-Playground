const Product= require('../models/Product')
const Order= require('../models/Order')
const {StatusCodes}= require('http-status-codes')
const CustomError= require('../errors')
const {checkPermissions}=require('../utils')



const fakeStripeAPI= async({amount,currency})=>{    // This is only for demo
    const client_secret= 'someRandomValue';
    return {client_secret,amount};
}

const createOrder= async (req,res)=>{
    const{items:cartItems,tax,shippingFee}=req.body;

    if(!cartItems||cartItems.length<1){
        throw new CustomError.BadRequestError('No Cart Items Provided');
    }
    if(!tax||!shippingFee){
        throw new CustomError.BadRequestError('Please provide Tax and Shipping Fee');
    }

    let orderItems=[];
    let subtotal=0;

    for(let item of cartItems){ // Using for of loop as we can not use await inside forEach or map method
        const dbProduct= await Product.findOne({_id:item.product})

        if(!dbProduct){
            throw new CustomError.NotFoundError(`No Product with id:${item.product}`);
        }

        const {name,price,image,_id}=dbProduct;
        const singleOrderItem={
            amount:item.amount,name,price,image,product:_id
        }

        
        // Add items to order array
        orderItems=[...orderItems,singleOrderItem];
    
        // Calculate the subtotal
        subtotal+=item.amount*price;
    }

    // Calculate the total
    const total= tax+shippingFee+subtotal;

    // Get client secret
    const paymentIntent= await fakeStripeAPI({ // This is a fake function to mimic the actual setup
        amount:total,
        currency:'inr' 
    })

    const order= await Order.create({
        orderItems,total,subtotal,tax,shippingFee,clientSecret:paymentIntent.client_secret,user:req.user.userId
    })

    res.status(StatusCodes.CREATED).json({order,clientSecret:order.clientSecret});

}

const getAllOrders= async (req,res)=>{
    const orders= await Order.find({})
    res.status(StatusCodes.OK).json({orders,count:orders.length});
}
const getSingleOrder= async (req,res)=>{
    const {id:orderId}= req.params;
    const order= await Order.findOne({_id:orderId});

    if(!order){
        throw new CustomError.NotFoundError(`No Order with id:${orderId}`);
    }

    checkPermissions(req.user,order.user);

    res.status(StatusCodes.OK).json({order});
}
const getCurrentUserOrders= async (req,res)=>{
    const orders= await Order.find({user:req.user.userId});

    res.status(StatusCodes.OK).json({orders,count:orders.length});
}

const updateOrder= async (req,res)=>{ // When the payment is successful, the frontend makes a patch request to this route to update the order status.

    const {id:orderId}= req.params;
    const {paymentIntentId}= req.body;  // Here, we are assuming that, if the frontend can only send paymentIntentId after the payment is successful.

    const order= await Order.findOne({_id:orderId});

    if(!order){
        throw new CustomError.NotFoundError(`No Order with id:${orderId}`);
    }

    checkPermissions(req.user,order.user);

    order.paymentIntentId= paymentIntentId;
    order.status= 'paid';
    await order.save();

    
    res.status(StatusCodes.OK).json({order});
}

module.exports={getAllOrders,getSingleOrder,getCurrentUserOrders,createOrder,updateOrder};

