//Joseph Livengood

var express = require('express');
var app = express();
var path = require("path");
var html_dir = './html/';

app.use(express.static(path.join(__dirname, 'html')));

app.get('/:i', function (req, res) {
    //get url, redirect
});

app.get('/index', function (req, res) {
  res.sendfile(html_dir + 'index.html');
});

app.get('/new/:url', function (req, res) {
  var input = decodeURI(req.params.url);
  var defaultresult = {"actual": null, "short": null};
  var result = defaultresult;

  res.json(result);
});

app.listen(process.env.PORT, function () {
  console.log('Example app listening on port ' + process.env.PORT +'!');
});