const express = require('express');
const service = express();
const cors = require('cors');
const port = 1339;
let router = express.Router();
const db = require("./pgdbstudent.js");

//req = request, res = response
service.get('/', (req, res) => {
  res.send('Welcome!');
});

service.get('/hi', (req, res) => {
  res.send('Hello!');
});

//sending a get request to the API (which is the console)
//path parameter (i.e.'name' variable) is initialized in url
service.get('/hello/:name', (req, res) => {
  //response from API
  res.send(`Hello ${req.params.name}`);
});

//gives you a 403 error if this endpoint is used
service.get('/error', (req, res) => {
  res.status(403).end();
});

router.get('/events', async(req, res, next) => {
  res.send("Calendar Events");
  next();
});


//setting up cors allows you to send requests from the browser
//alongside running the service (without it, you wouldn't be able to
//do both simultaneously)
let corsOptions = {
  origin: "*", //talks to anyone
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", //which methods service will allow
  allowedHeaders: "Authorization, Origin, Content-Type, Accept, X-Requested-With",
  maxAge: 0 //wouldn't usually be 0 but set to 0 here for the sake of learning. forces it to
  //renegotiate requests every time rather than caching data
};

//tells express framework to use cors when returning response
service.use(cors(corsOptions));

//tells express framework to use JSON when returning response
service.use(express.json() );
service.use( express.urlencoded( {extended: true }));

//must add the router endpoint to the '/calendar' endpoint
service.use('/calendar', router);

//specifies which JSON parameters to return in the response
//then 'res.send(result)'sends it back
service.post('/dogs', (req, res) => {
  let result = {
    id: 101,
    name: req.body.name,
    breed: req.body.breed,
    age: req.body.age
  };
  res.send(result);
});

//must append either send (html response), json or end (nothing) to 'res.' to close request
//if not done, your callback function must call a next() function so it knows to carry on


//error message will appear in terminal, not the browser
service.post('/students', async (req, res) => {
  await db.Insert({
    Name: req.body.name,
    Age: req.body.age,
    Course: req.body.course
  }, res);
  
  // res.status(201).send({
  //   Id: 101,
  //   Name: req.body.name,
  //   Age: req.body.age,
  //   Course: req.body.course
  // });
});

service.delete('/students/:id', async (req, res) => {

  await db.Delete(parseInt(req.params.id), res);
  
  // console.log("Delete student");
  // console.log(req.params.id);
  // res.send({});
});



service.get('/students', async (req, res) => {

  if(typeof req.query.name === "string") 
  {
  await db.SelectByName(req.query.name, res);
  }
  else {
  await db.Select(res);
  }

  // let data = [];

  // //checks for query parameter i.e. when you specify the '?name=Moo'
  // //e.g. http://localhost:1339/students?name=Moo
  // if(typeof req.query.name === "string")
  // {
  // console.log("Read the student's details");
  // console.log(req.query.name);
  // data[0] = {Id: 1, Name: req.query.name, Age:23, Course: "SE"};
  // data[1] = {Id: 2, Name: req.query.name, Age:24, Course: "WD"};
  // }
  // else
  // {
  // console.log("Read all student details");
  // data[0] = {Id: 1, Name:"Fred",Age:23, Course: "SE"};
  // data[1] = {Id: 2, Name:"Bob",Age:24, Course: "WD"};
  // }
  // res.send(data);
});

 //if the query parameter is not entered and a path parameter is provided i.e.
// http://localhost:1339/students/Moo
service.get('/students/:id', async (req, res) => {

  await db.SelectById(parseInt(req.params.id), res);


  // console.log("Read a student's details");
  // console.log(req.params.id);
  // res.send({Id: req.params.id, Name:"Fred", Age:23, Course: "SE" });
});



service.listen(port, () => console.log(`Example web service listening at http://localhost:${port}`));
