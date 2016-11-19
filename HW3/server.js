/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var MongoClient = require('mongodb').MongoClient
var db;

//please replace <Password>
MongoClient.connect('mongodb://cs336:<Password>@ds011251.mlab.com:11251/cs336calvin', function (err, dbConnection) {
  if (err) throw err
    db = dbConnection;
});


var COMMENTS_FILE = path.join(__dirname, 'comments.json');

app.set('port', (process.env.PORT || 3100));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.get('/api/comments', function(req, res){
      db.collection("people").find({}).toArray(function(err, data) {
        if (err) throw err;
        res.json(data);
    });
});

app.post('/api/comments', function(req,res){
  // NOTE: In a real implementation, we would likely rely on a database or
  // some other approach (e.g. UUIDs) to ensure a globally unique id. 
  var person = {
    id: req.body.id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    startDate: req.body.startDate,
  }
  db.collection("people").insertOne(person, function(err, result) {
        if (err) throw err;
        db.collection("people").find({}).toArray(function(err, data) {
            if (err) throw err;
            res.json(data);
        });
    });
 
});

//get /person/id (a person's full information)
app.get('/person/:id', function (req, res){
  db.collection("people").find({id: req.params.id}).toArray(function(err, data) {
        if (err) throw err;
        res.json(data);
    });
});

//get /people (list of persons)
app.get('/people', function(req, res){
      db.collection("people").find({}).toArray(function(err, data) {
        if (err) throw err;
        res.json(data);
    });
});

//Post /people to store new data from the html form
app.post('/people', function(req,res){
  var newPerson = {
    id: req.body.id,
    firstName: req.body.fName,
    lastName: req.body.lName,
    startDate: req.body.start,
  }
  db.collection("people").insertOne(newPerson, function(err, result) {
        if (err) throw err;
        db.collection("people").find({}).toArray(function(err, data) {
            if (err) throw err;
            res.json(data);
        });
    });
 
});

//Put /person/id to update existing data from html form
app.put('/person/:id', function (req, res){
  db.collection("people").update(
    {id : req.params.id}, 
    { $set: {
      firstName: req.body.fName, 
      lastName: req.body.lName, 
      "startDate" : req.body.startDate 
            }
    }, 
    {multi:true}, 
    function (err, updated) {
      if (err) throw err;
      if (updated < 1) {
      res.send("the ID did not exist");
      } else{
      res.send("Person of ID " +req.params.id + " updated");
      }
  });
});


//Delete /person/id to delete an account
app.delete('/person/:id', function(req,res){
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
app.get('/person/:id/name', function(req,res){
  db.collection("people").find({id: req.params.id}, {firstName: 1, lastName: 1}).toArray(function(err, data) {
        if (err) throw err;
        res.json(data);
    });
}); 


//get /person/id/years
app.get('/person/:id/years', function(req,res){
  db.collection("people").find({id: req.params.id}, {startDate: 1}).toArray(function(err, data) {
        if (err) throw err;
        res.json(data);
    });
});


//display the result queried by the search id form
app.get('/fetch', function (req, res) {
    var p = getPersonByloginID(req.query.id);
    if (p != null){
     res.json({
       'id'    : p.loginId,
       'firstName' : p.firstName,
       'lastName' : p.lastName,
       'startDate'  : p.startDate
    })}
    else{
      console.log("Person does not exist");
      res.status(404).send();
    }
}); 

//Function to choose person based on id
function getPersonByloginID(loginId){
 db.collection("people").find({id: req.body.id}).toArray(function(err, data) {
  if (err) throw err;
      res.json(docs);
 })
};

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

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
