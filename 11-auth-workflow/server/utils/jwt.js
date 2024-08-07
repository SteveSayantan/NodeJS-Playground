const jwt = require('jsonwebtoken');

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET); // No need to pass expiresIn property.
  return token;
};

const isTokenValid = ( token ) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({ res, user,refreshToken }) => {
/* 
  The accessToken is made of the user credentials. 
  But the refreshToken is made of user credentials as well as a hex string that is stored in DB.
*/
  const accessTokenJWT = createJWT({ payload:{ user }});    // Passing an object to the createJWT function with  'user' property inside 'payload'
  const refreshTokenJWT = createJWT({ payload:{ user,refreshToken }});  // Passing an object to the createJWT function with 'user' and 'refreshToken' properties inside 'payload'

  const oneDay = 1000 * 60 * 60 * 24;

// Adding Multiple Cookies

  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    maxAge:1000*60*15,    // With maxAge property also we can set the expiration time (in ms)
  });

  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });
};


const attachSingleCookieToResponse = ({ res, user }) => {   // Just for reference
  const token = createJWT({ payload: user });

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });
};

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};
