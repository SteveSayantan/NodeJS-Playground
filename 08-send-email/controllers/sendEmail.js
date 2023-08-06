const nodemailer= require('nodemailer');
const sgMail= require('@sendgrid/mail');

const sendEmailfuncEthereal= async(req,res)=>{

    // **First we need to create an account on https://ethereal.email ** and update the user and pass values before sending emails.

    // We need not to run the createTestAccount method (mentioned in nodemailer docs @ https://nodemailer.com/about) as we are already doing that by ourselves

    const transporter= nodemailer.createTransport(  //All these are copied from nodemailer docs.
        {
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, 
            auth: {
                user: 'daryl.gusikowski77@ethereal.email', // generated ethereal user
                pass: 'bVMg5eywn8NXsjzxpq',                 // generated ethereal password
        },
    });
    let info = await transporter.sendMail({ //All these are copied from nodemailer docs 

        from: '"Steve Sayantan" <sayan.manna.108@aot.edu.com>', // sender name and address (use random values )
        to: "bar@example.com, baz@example.com",                 // list of receivers, use comma to separate multiple users (use random emailID)
        subject: "Hello MF",            
        text: "Hello world?",           
        html: "<b>Hello world?</b>",   
      }); 
    res.json(info);
    /* 
    Nodemailer and Ethereal Usage: 
    
    1. Nodemailer package is used to make the logic for sending emails
    
    2. But, we have to use another service e.g. ethereal which will actually send the emails **while testing**
    
    3. By creating an account on Ethereal, we send (fake) emails from any random emailID to another random one for testing purposes. We can preview the sent emails too in our ethereal account.
    
    4. To get started, **first we need to create an account on https://ethereal.email **
    
    5. Now just replace the user and pass properties above with the new generated ones. We have to create a new Ethereal account everytime we log out of the existing one.
    */
}


const sendEmailfunc=async (req,res)=>{  //All of these are copied from the SENDGRID Docs 
  
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: 'sayantan.manna.22@aot.edu.in',     // Change to your recipient (Must be an actual email)
        from: 'sayantanmanna06@gmail.com',       // Change to your verified sender (Which was used while creating the user in SENDGRID)
        subject: 'Sending with SendGrid is Not Fun',
        text: 'This is only for testing purposes, second time'
      }
    
    const info= await sgMail.send(msg);
    res.json(info);

    /* 
    
    SENDGRID Usage:

    1. For production, we will use SENDGRID for sending emails.

    2. Go through the Integration guide @ https://app.sendgrid.com/guide/integrate for setting up the code and the API_KEY which is saved in the .env file.   
    
    */
}










module.exports= sendEmailfunc;