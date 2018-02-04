var MongoClient = require('mongodb').MongoClient;

exports.getRandomQuestion = function (cb) {
  MongoClient.connect(process.env.MONGO_URI, function(err, client) {
    const collection = client.db("jeopardy").collection("public");
    collection.aggregate([{ $sample: { size: 1 } }]).toArray(function(err, result) {
      if(err) {
        console.log(err);
        client.close();
        return cb(null, err);
      }
      client.close();
      return cb(result[0], null);
    });
  });
}

exports.getDate = function (datestring, cb) {
  MongoClient.connect(process.env.MONGO_URI, function(err, client) {
    const collection = client.db("jeopardy").collection("public");
    collection.find({ air_date: datestring }).toArray(function(err, results) {
      if(err) {
        console.log(err);
        client.close();
        return cb(null, err);
      }
      client.close();
      return cb(results, null);
    });
  });
}

exports.getRound = function (round, cb) {
  MongoClient.connect(process.env.MONGO_URI, function(err, client) {
    const collection = client.db("jeopardy").collection("public");
    collection.find({ round: round }).toArray(function(err, results) {
      if(err) {
        console.log(err);
        client.close();
        return cb(null, err);
      }
      client.close();
      return cb(results, null);
    });
  });
}
