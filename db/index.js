const MongoClient = require('mongodb').MongoClient;

exports.getRandomQuestion = async () => {
  try {
    var client = await MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }); // Connect to Mongo client
    const collection = client.db(process.env.MONGO_DATABASE).collection(process.env.MONGO_COLLECTION); // Find database and collection
    var result = await collection.aggregate([{ $sample: { size: 1 } }]).toArray(); // Return one random sample from collection
  } catch (e) {
    return Promise.reject(e);
  }
  client.close();
  return Promise.resolve(result[0]);
};
