//Homework2
//CS 336
//Author: Moses Mangunrahardja
//Express Routing modified 


var express = require("express");
var app = express();
//Create Router() object
var router = express.Router();
var http_status = require("http-status-codes");
var bodyParser = require("body-parser");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//constructor
function person(loginId, firstName, lastName, startDate){
	this.loginId = loginId;
	this.firstName = firstName;
	this.lastName = lastName;
	this.startDate = startDate;
}

var person1 = new person(1, "John", "Doe", "2000/01/01");
var person2 = new person(2, "Jane", "Don", "1980/12/11");
var people =[person1, person2];

// Tell express to use this router with /api before.
app.use("/",router);

// Listen to this Port
app.listen(3000,function(){
  console.log("Live at Port 3000");
});

//Root
router.get("/",function(req,res){
  res.send("Hello world! This is Root for Homework2");
});

//get /people (list of persons)
router.get('/people', function(req, res, next){
	res.json(people);
});

//Post /people to store new data from the html form
router.post('/people', function(req,res){
	console.log(req.body);
 	people.push(new person(req.body.id, req.body.fName, req.body.lName, req.body.start));
 	res.json({message: "Success"});
});


//get /person/id (a person's full information)
router.get("/person/:id",function(req,res){
  if(req.params.id == 0) {
    res.json({"message" : "You must pass ID other than 0"});    
  }
  else{ 
  	res.json(getPersonByloginID(req.params.id))
  };
});

//Put /person/id to update existing data from html form
router.put('/person/:id', function(req, res){
	if(getPersonByloginID(req.params.id) == null) {
    res.json({"message" : "the ID did not exist"});    
  }
  else{ 
  	for(i=0; i<people.length; i++){
  			if( people[i].loginId == req.params.id){
  				people[i].firstName = req.body.fName;
  				people[i].lastName = req.body.lName;
  				people[i].startDate = req.body.startDate;
  				res.send("Person of ID " +req.params.id + " updated");
  			}
  		}
	}
});

//Delete /person/id to delete an account
router.delete("/person/:id",function(req,res){
  	if(getPersonByloginID(req.params.id) == null) {
  		res.json({"message" : "the ID did not exist"});    
  }
  else{ 
  	for(i=0; i<people.length; i++){
    	if(people[i] != null && people[i].loginId == req.params.id){
        	delete people[i];
        	res.send({"message" : "deleted person of ID: " + req.params.id});
      		}
    	}
  	}
});


//get /person/id/name (Full name of the person with the given id)
router.get("/person/:id/name", function(req,res){
  if(req.params.id == 0) {
    res.json({"message" : "You must pass ID other than 0"});    
  }
  else{ 
  	res.json(getNameByloginID(people, req.params.id, res))
  };
});

//Function to choose person based on id
function getPersonByloginID(loginId){
	for (var i = 0; i < people.length; i++){
		if(people[i].loginId == loginId){
		return people[i];
	 	}
	}
	console.log("Error 404. ID " + loginId + " does not exist");
}

//Function to return full name
function getNameByloginID(people, loginId, res){
	for (var i = 0; i < people.length; i++){
		if(people[i].loginId == loginId){
		return people[i].firstName + " " + people[i].lastName;
	 	}
	}
	res.status(404).json("Error 404. ID " + loginId + " does not exist");
}

//Calculate how long the person have been working there (rounded down to nearest year)
function getSeniority(startDate){
	var now = new Date();
	var start = new Date(startDate);
	var year = now.getFullYear() - start.getFullYear();
	var month = now.getMonth() - start.getMonth();
	if (month < 0 || (month === 0 && now.getDate() < start.getDate())){
		year--;
	}
return year;
}

//get /person/id/years (Shows how many years the person have been with the organization) 
router.get("/person/:id/years",function(req,res){
 	var person = getPersonByloginID(req.params.id).startDate;
 	res.json(getSeniority(person) + " Years");

  });

//display the result queried by the search id form
router.get('/fetch', function (req, res) {
    var p = getPersonByloginID(req.query.id);
    if (p != null){
   	 res.json({
   	 	 'id'    : p.loginId,
   		 'fName' : p.firstName,
    	 'lName' : p.lastName,
   		 'date'  : p.startDate
		})}
    else{
      console.log("Person does not exist");
      res.status(404).send();
    }

  }); 