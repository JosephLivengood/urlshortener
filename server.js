//Joseph Livengood

var express = require('express');
var app = express();
var path = require("path");

app.get('/new/:url', function (req, res) {
  var input = req.params.url;
  res.json(input);
});

app.listen(process.env.PORT, function () {
  console.log('Example app listening on port ' + process.env.PORT +'!');
});