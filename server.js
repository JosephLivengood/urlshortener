//Joseph Livengood

var express = require('express');
var app = express();
var mongo = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/urlshortener';
var ObjectId = require('mongodb').ObjectID;

app.get('/new/:url', function (req, res) {
  var input = req.params.url;
  var doc = {
    url: input
  };
  mongo.connect(url, function(err, db) {
    if (err) throw err;
    var collection = db.collection('url');
    collection.insert(doc, function(err, data) {
      if (err) throw err;
      console.log(JSON.stringify(doc));
      res.json({
        'orginalurl': doc.url,
        'shortened': 'URL/'+doc._id
      });
      db.close;
    });
  });
});

app.get('/url/:shortenedurl', function (req, res) {
  var input = req.params.shortenedurl;
  mongo.connect(url, function(err, db) {
    if (err) throw err;
    var collection = db.collection('url');
    collection.find({
      _id: new ObjectId(input)
    }).toArray(function(err,data) {
      if (err) console.log(err);
      console.log(data);
      res.statusCode = 302;
      res.setHeader("Location", data[0].url);
      res.end();
      db.close();
    })
  });
})

app.listen(process.env.PORT, function () {
  console.log('Sever listening on port ' + process.env.PORT +'!');
});