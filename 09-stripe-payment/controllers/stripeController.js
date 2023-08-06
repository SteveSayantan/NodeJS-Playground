/* 
    WorkFlow in Stripe:

    1. Instead of sending a payment request from the frontend directly to stripe, we connect with our backend (which is more secure than frontend as frontend data can be manipulated easily) to do some verification.
    
    2. If everything is correct , we send a secret-key to the frontend and then we can proceed with the payment. 

    3. All the amounts used should be in the smallest unit of currency i.e. paise in case of INR.

    4. Take a look at browser-app.js file in public, to get an overview of how the complete payment works.

    5. Checkout the docs at: https://stripe.com/docs/payments/quickstart  for further queries.

*/
const stripe= require('stripe')(process.env.STRIPE_SECRET_KEY);

const stripeController= async(req,res)=>{

    const {purchase,total_amount,shipping_fee}=req.body;

    const calculateAmount=()=>total_amount+shipping_fee;    // In real world, we will verify the amount requested by the front-end and the actual amount using database

    const paymentIntent= await stripe.paymentIntents.create(
        {
        amount:calculateAmount(),
        currency:'inr',
        description:"Software Development Services"
         })   
    //   console.log(paymentIntent);
    res.json({clientSecret:paymentIntent.client_secret});   
}

module.exports=stripeController;