var MongoClient = require('mongodb').MongoClient;

exports.getRandomQuestion = async () => {
  try {
    var client = await MongoClient.connect(process.env.MONGO_URI);
  } catch (e) {
    return Promise.reject(e);
  }
  const collection = client.db(process.env.MONGO_DATABASE).collection(process.env.MONGO_COLLECTION);
  try {
    var result = await collection.aggregate([{ $sample: { size: 1 } }]).toArray();
  } catch (e) {
    return Promise.reject(e);
  }
  client.close();
  return Promise.resolve(result[0]);
}
