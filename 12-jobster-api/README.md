# Jobster API



#### Remove CORS

- we don't want external JS apps to access our API (only our front-end)
- remove these lines of code

```js
const cors = require('cors');
app.use(cors());
```


##### Dist Folder

- Make sure the base url points to our current server (instead of the deployed url)

utils/axios.js

```js
const customFetch = axios.create({
  baseURL: '/api/v1',
});
```


#### Modify User Model

- add lastName and location properties to the User Model . Assign a default value as the user can not provide those while registration.


#### Modify Response in Register and Login

- change the response structure in
  register and login controllers as per the requirement of the frontend

#### Create Test User

- Create a Demo user with values provided in the frontend (in Register.jsx)

#### Update User Functionality

- setup updateUser route (protected route) and corresponding controller

- Send a new token each time user is updated as token contains the name of the user which might be changed.

#### GOTCHA

- The pre-save hook will run everytime we update the user , fix that.

#### Modify Job Model

- add jobType and jobLocation properties

- default property just for fun, values will be provided by front-end

#### Setup Mock Data

- [Mockaroo](https://www.mockaroo.com/)
- The `Field Name`s should match exactly to the properties we have in Job model.
- The `Type` specifies what type of data to be used for that particular field. It has a lot of options available.

- Use the id of the testuser for `createdBy` field.

- The fields should look something like [this](./assets/Mockaroo_exmaple.JPG) 

#### Populate DB

- populate the db with the mock data.

#### Modify Get All Jobs

- Remember, if the none of the properties provided in the queryObject matches the properties in the schema, all the documents associated with that schema will be returned (From Mongoose 6+)

- Add filter and sort to getAllJobs controller 
- Set up pagination

#### Make Test User Read-Only

- In authentication.js, check for test-user.

- Create a middleware that restricts test-user from performing the CRUD operations.

- add to auth routes (updateUser)

- add to job routes (createJob, updateJob, deleteJob)


#### API Limiter

- Create a middleware using `express-rate-limit` and attach it before register and login controller

app.js

```js
app.set('trust proxy', 1);

app.use(express.static(path.resolve(__dirname, './client/build')));
```

#### Setup Stats Route

- Set up a dummy controller and route for displaying the stats.

- First we have to match our documents acc. to an user.

- Now, we have to group our documents wrt to their status and calculate the number of each type.

- To achieve this, our pipeline should look something like [this](./assets/Pipeline_JobStatus.JPG)

- Now, we have to set a pipeline to group the documents according to the year and month of creation.

- First we have to match our documents acc. to an user.

- Next, we have to group those acc. to month and year and calculate number of documents.

- Now, we have to sort the result acc. to year and month

- Lastly, we have to limit the result upto 6 as we want to show stats for last 6 months.

- To achieve this, our 4 stage pipeline should look something like [this](./assets/Pipeline_CreationTime.JPG)

- Collect the Node.js version of code using **EXPORT TO LANGUAGE** everytime.

#### Deploy

- remove existing git repo

- add reverse() in showStats

controllers/jobs.js

```js
monthlyApplications = monthlyApplications
  .map((item) => {
    const {
      _id: { year, month },
      count,
    } = item;
    const date = moment()
      .month(month - 1)
      .year(year)
      .format('MMM Y');
    return { date, count };
  })
  .reverse();
```

- remove Procfile
- remove engines from package.json

```json
"engines": {
    "node": "16.x"
  }
```

- fix build folder (remove /build from client/.gitignore)
- setup new github repo
- deploy to render