### JWT Secret Key
For generating JWT secret key, we can go [here](allkeysgenerator.com) and get us a **256-bit** key

### Registration
While registering an user, we don't want to send the token until the user verifies his email. 
Hence, we have to add some more properties to our User schema.

### Login
Here, after checking for the correct password, we shall allow the user only if he is verified, otherwise no access will be allowed.

### Verification Token
We create a verification token using crypto library and save it in our db with the user document.

### Main Idea
The link to verify the email will contain this token. Frontend will collect this token and send a request to backend with the token and email of the user. If it matches, then the user will be verified.

### Verify Email
Get verificationToken and email from request body. Find the user with that email.  Match the verification token with the one saved. On success, mark the user as verified and set the verificationToken as an empty string.

### Sending Email
First, we need to create an Ethereal account (for getting a fake email id) . Now, we shall use nodemailer package for sending the emails.

### Send Verification Email
In the verification email, we shall send a link which will contain the verification token (saved in db ) and the email address of the user. When user clicks that link, he will be redirected to a page and the front-end (internally) will make a POST request to verify-email route.

### Refresh Token
Since we are using one token approach, when the cookie expiers, the token won't be valid any longer. Therefore, the user may be logged out of the application all of a sudden.

To avoid such things, we're using two token approach.

- [ ] we need to create a schema for tokens

- [ ] when the user logs in, after performing initial checks, we check if that user already has a token stored in the db (existing user) or not (new user). In case of a new user, a token is created for that user. Otherwise, it is checked if the user is valid (not blocked).

- [ ] Add functionality to send two tokens as cookies with response.

- [ ] Add functionality to the middleware for checking both access and refresh token.

Read the description in authController.js for more info.

### Logout
- [ ] The logout request should be a DELETE request.

- [ ] Delete the Token document saved in db.

- [ ] Send two dummy tokens as access and refresh token.

### Reset/Forgot Password

- [ ] Modify the User Schema.

- [ ] Set controller and route (template) for reset and forgot password.

- [ ] For forgot password controller, check for the email. Find the user with that email. Create a hex token, an expiry time and save in User model.
    - [ ] Send an email to the user similar to what we did to verify email.

- [ ] For reset password controller, 
    - [ ] check for the token, email and password (sent by the frontend). 
    - [ ] Find the user with that email. 
    - [ ] Match the received token and check the expiration time is greater than the current time.
    - [ ] Set the new password, set passwordToken and passwordTokenExpirationDate to null

### Hashing reset password token
- [ ] For security purposes, it is a good idea to hash the reset password token before saving it to the db. 
- [ ] However, the reset password link will contain the original token.
- [ ] After receiving the original token, that has to be hashed and compared with the saved token








