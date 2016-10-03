//Joseph Livengood October 2016
var express = require('express');
var app = express();
var mongo = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/urlshortener';
var ObjectId = require('mongodb').ObjectID;

//works on anything. most complicated regex ever.
function IsURL(url) {
  var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
      + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftpuser@
      + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP URL- 199.194.52.184
      + "|" // IP/DOMAIN
      + "([0-9a-z_!~*'()-]+\.)*" // www.
      + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\."
      + "[a-z]{2,6})" // first level domain
      + "(:[0-9]{1,4})?" // :80 ?
      + "((/?)|" // a slash isn't required if there is no file name
      + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
   var re=new RegExp(strRegex);
   return re.test(url);
}

app.get('/new/:url', function (req, res) {
  var input = req.params.url;
  var doc = {
    url: input
  };
  if (!IsURL(doc.url)) {
    res.json({
        'orginalurl': doc.url,
        'shortened': 'error: invalid URL'
      });
  } else {
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
  }
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