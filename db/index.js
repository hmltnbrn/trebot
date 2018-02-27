var MongoClient = require('mongodb').MongoClient;

exports.getRandomQuestion = function (cb) {
  MongoClient.connect(process.env.MONGO_URI, function(err, client) {
    const collection = client.db(process.env.MONGO_DATABASE).collection(process.env.MONGO_COLLECTION);
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
