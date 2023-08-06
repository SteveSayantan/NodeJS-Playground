const sendEmail= require('./sendEmail')


const sendVerificationEmail= async({name,email,verificationToken,origin})=>{

    const verifyEmail= `${origin}/user/verify-email?token=${verificationToken}&email=${email}`  // We have this 'localhost:3000/user/verify-token' route in the frontend already. Additionally, we are sending the token and the email as query string. Now, frontend can make request to the server with those values.

    const message=`<p>Please confirm your email by clicking on the following link: <a href="${verifyEmail}">Verify Email</a> </p>`

    return sendEmail({to:email,subject:'Email Confirmation',html:`<h4>Hello, ${name}</h4>${message}`})
}

module.exports= sendVerificationEmail;