const MongoClient = require('mongodb').MongoClient;

exports.getRandomQuestion = async () => {
  try {
    var client = await MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }); // Connect to Mongo client
    const collection = client.db(process.env.MONGO_DATABASE).collection(process.env.MONGO_CLUE_COLLECTION); // Find database and collection
    var result = await collection.aggregate([
      { $sample: { size: 1 } }
    ]).toArray(); // Return one random sample from collection
  } catch (e) {
    return Promise.reject(e);
  }
  client.close();
  return Promise.resolve(result[0]);
};

exports.setContestantScore = async (guildId, member, value) => {
  try {
    var client = await MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }); // Connect to Mongo client
    const collection = client.db(process.env.MONGO_DATABASE).collection(process.env.MONGO_CONTESTANT_COLLECTION); // Find database and collection
    var contestant = await collection.findOneAndUpdate(
      { server_id: guildId, member_id: member.id },
      { $inc: { "score" : value, "correct_answers": 1 }, $set: { user_tag: member.user.tag } },
      { returnOriginal: false, upsert: true }
    ); // Find contestant from specific server and increment score or create new document
  } catch (e) {
    return Promise.reject(e);
  }
  client.close();
  return Promise.resolve(contestant.value);
};

exports.getContestants = async (guildId) => {
  try {
    var client = await MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }); // Connect to Mongo client
    const collection = client.db(process.env.MONGO_DATABASE).collection(process.env.MONGO_CONTESTANT_COLLECTION); // Find database and collection
    var contestants = await collection.find(
      { server_id: guildId }
    ).toArray(); // Find all contestants for a specific server
  } catch (e) {
    return Promise.reject(e);
  }
  client.close();
  return Promise.resolve(contestants);
};
