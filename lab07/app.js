/*
Author: Moses Mangunrahardja
Lab 07
JQuery & Ajax
Exercise 7
*/

const express = require('express');
const app = express();
const http_status = require('http-status-codes');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const HOST = "localhost";
const PORT = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());



app.get('/', function (req, res) {
  res.send('Hello World!');
});


app.get('/fetch', function(req, res){
 res.json({content: "Hello, " + req.query.name + ""});
})



app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
  });

