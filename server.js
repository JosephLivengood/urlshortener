//Joseph Livengood

var express = require('express');
var app = express();
var path = require("path");
var mongo = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/urlshortener';

app.get('/new/:url', function (req, res) {
  var input = req.params.url;
  var doc = {
    url: input
  }
  mongo.connect(url, function(err, db) {
    if (err) throw err;
    var collection = db.collection('url');
    collection.insert(doc, function(err, data) {
      if (err) throw err;
      //console.log(input+doc._id);
      console.log(JSON.stringify(doc));
      //res.json(doc);
      res.json({
        'orginalurl': doc.url,
        'shortened': 'URL/'+doc._id
      })
      db.close;
    })
  });
  //res.json(input); //res.send()
});

app.listen(process.env.PORT, function () {
  console.log('Example app listening on port ' + process.env.PORT +'!');
});