/*
Author: Moses Mangunrahardja
Lab 06
HTTP

Exercise 6.1
Questions:
A. 
Successful Curl commands:
1. curl htp://localhost:3000/request
	This command returns the http status I set whcih is "Accepted".
2. curl --head http://localhost:3000/request
	This command returns succefully

HTTP/1.1 202 Accepted
X-Powered-By: Express
Content-Type: text/plain; charset=utf-8
Content-Length: 8
ETag: W/"8-OCq1IpMWc8EeOY6tG3sWeA"
Date: Fri, 14 Oct 2016 22:23:37 GMT
Connection: keep-alive

Tried but not succesfull:
3. curl -x put http://localhost:3000/forms -d {"user_name":"moses"} -H 'Content-Type: application/json'
	Returns: curl: (5) Could not resolve proxy: put
4. curl -x post http://localhost:3000/forms -d {"user_name":"moses"} -H 'Content-Type: application/json'
	Returns: curl: (5) Could not resolve proxy: post
5. curl -x post http://localhost:3000/forms -d {"user_name":"moses"} -H 'Content-Type: application/json'
	Returns: curl: (5) Could not resolve proxy: get
I tried to bypass proxy but it doesn't work. I think there is a proxy in my machine that is blocking the curl request.


B. 
A page not found error shuld be appropriate to be displayed for pages that aren’t defined by an Express route

Exercise 6.2
A. Forms only supports POST and GET methods. (Tried delete and it doesn't work)
B. The action method (tied to an URL ".../forms") requests the method "post" to the server whehn submitted. 
The action method would send a body, which includes the input data in the form to the server, where the server 
is then able to use that input data, then sends it back to the client. The data is not modified in any way.
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

app.get('/request', function(req, res){
	res.sendStatus(http_status.ACCEPTED);
	res.send("This is the get request response");
});

app.post('/request', function(req, res){
	res.sendStatus(http_status.OK);
	res.send("This is the post request response");
});

app.put('/request', function(req, res){
	res.sendStatus(http_status.CONTINUE);
	res.send("This is the put request response");
});

app.head('/request', function(req, res){
	res.sendStatus(http_status.CREATED);
	res.send("This is the head request response");
});

app.delete('/request', function(req, res){
	res.sendStatus(http_status.FORBIDDEN);
	res.send("This is the delete request response");
});

app.post('/forms', function(req, res){
	res.send("Hi "+ req.body.user_name + ", this is your email: "+ req.body.user_mail+ 
		", and this is your message: "+ req.body.user_message);
	res.sendStatus(http_status.OK);
	
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
  });

