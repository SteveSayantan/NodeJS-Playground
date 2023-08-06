const nodemailer= require('nodemailer');
const nodemailerConfig= require('./nodemailerConfig');

const sendEmail= async ({to,subject,html})=>{     // Making this function dynamic

    const transporter = nodemailer.createTransport(nodemailerConfig);

     return transporter.sendMail({  // As the sendEmail function itsef is an async function (returns a promise), we can directly return transporter.sendEmail function from it(As this also returns a promise)
        from: '"Steve Sayantan" <sayan.manna.69@chudurbudur.com>', 
        to,subject,html });
        
        
        /* Previous setup (Just for Reference)

        let info= await transporter.sendMail({

            //  blah blah blah 
        }) 
        */ 
        
}

module.exports= sendEmail;