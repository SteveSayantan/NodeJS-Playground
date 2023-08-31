## Hosted Project

[E-Commerce API Heroku URL](https://e-commerce-api-10.herokuapp.com/)

## Workflow

### First Part

- [ ] Create User Model
- [ ] Add validator function to the email 


### Second Part

- [ ] Create Register,Login,Logout controller (Template)
- [ ] Create routes for the same 
- [ ] Add router to the app.js 

### Third Part

- [ ] Create Register controller (Functionality)
  - [ ] Check for duplicate values and throw error if required. 
  - [ ] If it is the first user, then set the role as admin.
  - [ ] Create the user.
  - [ ] Select some properties of the user (e.g. username,id,role) to make the jwt .
  - [ ] Create jwt and attach it as cookie to the response (create a utility function for this).
  - [ ] Send the selected properties of the user as JSON with response .

- [ ] Hashing the password using pre-save hook.
  - [ ] Setup a comparePassword function as a method in the UserSchema.

- [ ] Setup a utility function to verify the jwt token .

- [ ] For parsing the cookie use the cookieparser package .

### Login Functionality

- [ ] First check if any user exists using given email .
- [ ] If exists, compare the passwords .
- [ ] If password is correct, create a jwt in the same way as above .
- [ ] Attach the jwt to the response as cookie.
- [ ] Send the same response as above .

### Logout Functionality

- [ ] Set a cookie with the same name as above. But it will contain a random string e.g. 'logout' and expire within few seconds 
- [ ] Send the success response .


### Authentication 

- [ ] Create a middleware that checks and validates the token, and extracts info from it to attach that to the request object.

- [ ] Create a middleware that allows access to a certain route only if the request object has specific role .

- [ ] Create a utility function that allows the admin or the user itself to access info about an user .

### User Routes

- [ ] Create getAllUsers,showCurrentUser,updateUser,updateUserPassword,getSingleUser template.

- [ ] Create the router and add to the app.js .

- [ ] For getAllUsers, respond with all users where role is 'user' and remove password from response.

- [ ] For getSingleUser, respond with the user having the same id . Remove password from response. Also check if it is the admin or the same user accessing the info.

- [ ] For showCurrentUser, respond with the user present in the request object. 

- [ ] For updateUserPassword, check if both old and new passwords are provided. Now, if the password is correct, update user fields and invoke save() method. 

- [ ] For updateUser, check if name and email are provided. Now, update user fields and invoke save() method. Also, create a new cookie with updated values and attach it to the response. Send the updated user with response
  
- [ ] Add appropriate authentication middlewares to the routes .

### Product Model

- [ ] Create Product Schema and add fields .

### Product Routes

- [ ] Create Product Controller templates .
- [ ] Create the router with appropriate middlewares and add it to app.js .

- [ ] For createProduct, create a user property in request body and pass the whole request body , return the created product.

- [ ] Set up getAllProducts and getSingleProduct controllers.

- [ ] Set up updateProduct controller using findOneAndUpdate() method.

- [ ] Set up deleteProduct controller using product.remove() method.

- [ ] Set up deleteProduct controller using product.remove() method.

- [ ] For uploadImage route, use express-file-upload package . Check whether the file exists, its type and size . Now, store the image in the public/uploads dir. Return the file path (on server) in JSON.

### Reviews

- [ ] Create Review model (It should contain reference to user and product)

- [ ] Create Review controller (template) and Review Router with proper middlewares.

- [ ] For createReview, check if a product exists and the user has already submitted a review for that product. After that, we can allow the user to create a review.

- [ ] Set up getAllReview and populate some properties of the product and user associated with each review.

- [ ] For getSingleReview, first check if the review exists. Populate some properties of the product and user associated with that review and return it in JSON format .

- [ ] For deleteReview, first check if the review exists. If the user is the author of the review then delete it using remove() method. 
  - [ ] Also set up a pre() hook in Product Schema for deleting all associated reviews when a product is deleted.

- [ ] For updateReview, first check if the review exists. If the user is the author of the review then update it using save() method.


- [ ] For getSingleProductReview, find the reviews for the given product id. Return it in JSON format .

### Mongoose Virtuals

- [ ] Set up 'reviews' virtual property in the Product Schema.

### Aggregate PipeLine

- [ ] Set up a function for calculating the average rating and total no. of reviews for a product

- [ ] Set up the aggregation pipeline 

- [ ] Call this function when a review is created or deleted.

### Order 

- [ ] Create a Schema for a single item and another one for containing all the items as an entire order. 

- [ ] Create controllers and routes with suitable middlewares. 


