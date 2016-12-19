/**
 * This website is designed to allow students to request items of equipment to rent
 *  from the Calvin College Student Senate. They will be able to rent items and
 *  later show up in person to retrieve them, or add their name to a waiting list if 
 *  they really would like to rent the item at some point in the future.

 *Names: Jahn Davis, Moses Mangunrahardja\
 *Date: Decemeber 19th, 2016
 *Course: CS-336
 *Professor Vander Linden
*/

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var MongoClient = require('mongodb').MongoClient

var db;
var APP_PATH = path.join(__dirname, 'dist');

//please replace <Password>
MongoClient.connect('mongodb://cs336:bjarne@ds127958.mlab.com:27958/eqrental', function (err, dbConnection) {
  if (err) throw err
  	db = dbConnection;
});


app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(APP_PATH));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

//Fetches the items from our database
app.get('/api/comments', function(req, res) {
    db.collection("comments").find({}).toArray(function(err, docs) {
        if (err) throw err;
        res.json(docs);
    });
});

//Posts a new item to the database
app.post('/api/comments', function(req, res) {
    var newComment = {
        id: Date.now(),
        author: req.body.author,
        text: req.body.text,
    };
    db.collection("comments").insertOne(newComment, function(err, result) {
        if (err) throw err;
        db.collection("comments").find({}).toArray(function(err, docs) {
            if (err) throw err;
            res.json(docs);
        });
    });
});


app.get('/api/comments/:id', function(req, res) {
    db.collection("comments").find({"id": Number(req.params.id)}).toArray(function(err, docs) {
        if (err) throw err;
        res.json(docs);
    });
});

app.put('/api/comments/:id', function(req, res) {
    var updateId = Number(req.params.id);
    var update = req.body;
    db.collection('comments').updateOne(
        { id: updateId },
        { $set: update },
        function(err, result) {
            if (err) throw err;
            db.collection("comments").find({}).toArray(function(err, docs) {
                if (err) throw err;
                res.json(docs);
            });
        });
});

//Adds a user to the waiting list for an item
app.post('/api/comments/:id/waitUsers', function(req, res) {
	var commentId = Number(req.params.id);
	var newUser = req.body; // expecting { user: "userName" }
	var result;

	db.collection('comments').updateOne({ id: commentId },
	{$addToSet: newUser},
	function(err, result) {
		if (err) throw err;

		db.collection('comments').findOne({id: commentId}, {fields: {'waitUsers': 1}}, function(err, updatedUserList) {
			if (err) throw err;
			result = updatedUserList;
		});
	});

	res.json(result);
});

//Removes a person from the waiting list
app.delete('/api/comments/:id/waitUsers', function(req, res) {
var commentId = Number(req.params.id);
	var newUser = req.body; // expecting { user: "userName" }
	var result;

	db.collection('comments').deleteOne({ id: commentId },
	{$addToSet: newUser},
	function(err, result) {
		if (err) throw err;

		db.collection('comments').findOne({id: commentId}, {fields: {'waitUsers': 1}}, function(err, updatedUserList) {
			if (err) throw err;
			result = updatedUserList;
		});
	});

	res.json(result);
});

//Deletes an item from the database
app.delete('/api/comments/:id', function(req, res) {
    db.collection("comments").deleteOne(
        {'id': Number(req.params.id)},
        function(err, result) {
            if (err) throw err;
            db.collection("comments").find({}).toArray(function(err, docs) {
                if (err) throw err;
                res.json(docs);
            });
        });
});

// Send all routes/methods not specified above to the app root.
app.use('*', express.static(APP_PATH));

app.listen(app.get('port'), function() {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});

