//Homework1
//CS 336
//Author: Moses Mangunrahardja
//Express Routing


var express = require("express");
var app = express();
//Create Router() object
var router = express.Router();

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
  res.send("Hello world! This is Root");
});

//get /people (list of persons)
router.get('/people', function(req, res, next){
	res.json(people);
});

//get /person/id (a person's full information)
router.get("/person/:id",function(req,res){
  if(req.params.id == 0) {
    res.json({"message" : "You must pass ID other than 0"});    
  }
  else{ 
  	res.json(getPersonByloginID(people, req.params.id, res))
  };
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
function getPersonByloginID(people, loginId, res){
	for (var i = 0; i < people.length; i++){
		if(people[i].loginId == loginId){
		return people[i];
	 	}
	}
	res.status(404).json("Error 404. ID " + loginId + " does not exist");
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
 	var person = getPersonByloginID(people, req.params.id, res).startDate;
 	res.json(getSeniority(person) + " Years");

  });