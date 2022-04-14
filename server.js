var express = require('express');
var app = express();
var port = process.env.port || 1337;

var bodyParser = require('body-parser');
// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: true }));
// create application/json parser
app.use(bodyParser.json());

var quoteController = require('./Controller/QuoteController')();

app.use("/api/quote", quoteController);
 
app.listen(port, function () {
    var datetime = new Date();
    var message = "Server running on Port:- " + port + "Started at :- " + datetime;
    console.log(message);
});