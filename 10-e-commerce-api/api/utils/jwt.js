//In this case, we are placing these functions in utils folder for code reusability


const jwt= require('jsonwebtoken');

//We could have passed the argument directly in the following functions instead of destructuring 

const createJWT= ({payload})=>{     
    return jwt.sign(payload, process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME});
}

const isTokenValid= ({token})=>jwt.verify(token, process.env.JWT_SECRET);   //This returns the decoded token

const attachCookiesToResponse= ({res,user})=>{
    const token= createJWT({payload:user})

    res.cookie('token',token,{  // We can use any string value as the name of the cookie (first arg) . Checkout https://expressjs.com/en/4x/api.html#res.cookie for details
       
        httpOnly:true,      // Checkout the docs for details about these properties
        expires:new Date(Date.now()+24*60*60*1000),  //Expires in one day

        secure:process.env.NODE_ENV=='production' ,  // secure property makes the browser send the cookies over HTTPS. 
        // But in development, as we are using HTTP, its value will be true only in production (due to this logic)

        signed:true     //This is to send signed cookies (more secure, prevents tampering). To sign this (with the help of cookie-parser package), we must pass a signature string while invoking the cookie parser in app.js 

    })
}

/* 
    Some Gotchas about cookies:

    1. If the httpOnly property is set to true, the cookie can only be accessed by the browser while making http requests.

    2. Each cookie has a max size of  4096 bytes

    3. While sending cookies from the backend, the frontend does not need to perform any extra task for storing or sending the cookie as that is taken care of by the browser.

    4. Cookies can only be sent within the same domain. E.g., if we have our frontEnd running on localhost:3000 and our backEnd running on localhost:5000, we can not send cookies from our backend to our frontend. 

    5. **If our front-end is using Create-react-app**, and is hosted on a different server(e.g. localhost 3000) ,we can set a "proxy" (use quotes) property at the last line of package.json (of the React app) as "http://127.0.0.1:5000" (the url of our backend). After this, we can simply write "/api/v1/auth" for making request from the React frontend (hosted on localhost 3000). 
    No need not add "http://localhost:5000" before each url in the frontend code for making request to the server located on port 5000.

    6. We can also send and receive cookies to different domain with the setup mentioned above.

    7. Similarly, we can use the proxy option for vite builds also. Check the docs https://vite.dev/config/server-options#server-proxy for details.

    8. This works because when we request to the server using frontend, the server considers this request as a Same-Origin request and agrees to share resources.

    9. The above steps are applicable only during the development phase.
    
    10. In production, such approach is not useful as third-party cookies are not allowed by the browser.

*/

module.exports={createJWT,isTokenValid,attachCookiesToResponse};