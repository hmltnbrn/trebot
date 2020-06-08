const MongoClient = require('mongodb').MongoClient;

exports.getRandomQuestion = async () => {
  try {
    const client = await MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }); // Connect to Mongo client
    const collection = client.db(process.env.MONGO_DATABASE).collection(process.env.MONGO_CLUE_COLLECTION); // Find database and collection
    const result = await collection.aggregate([
      { $sample: { size: 1 } }
    ]).toArray(); // Return one random sample from collection
    client.close();
    return Promise.resolve(result[0]);
  } catch (e) {
    return Promise.reject(e);
  }
};

exports.increaseContestantScore = async (guildId, member, value) => {
  try {
    const client = await MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }); // Connect to Mongo client
    const collection = client.db(process.env.MONGO_DATABASE).collection(process.env.MONGO_CONTESTANT_COLLECTION); // Find database and collection
    const contestant = await collection.findOneAndUpdate(
      { server_id: guildId, member_id: member.id },
      { $inc: { "score" : value, "correct_answers": 1 }, $set: { user_tag: member.user.tag } },
      { returnOriginal: false, upsert: true }
    ); // Find contestant from specific server and increment score or create new document
    client.close();
    return Promise.resolve(contestant.value);
  } catch (e) {
    return Promise.reject(e);
  }
};

exports.decreaseContestantScore = async (guildId, member, value) => {
  try {
    const client = await MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }); // Connect to Mongo client
    const collection = client.db(process.env.MONGO_DATABASE).collection(process.env.MONGO_CONTESTANT_COLLECTION); // Find database and collection
    const contestant = await collection.findOneAndUpdate(
      { server_id: guildId, member_id: member.id },
      { $inc: { "score" : -1*value, "incorrect_answers": 1 }, $set: { user_tag: member.user.tag } },
      { returnOriginal: false, upsert: true }
    ); // Find contestant from specific server and decrement score or create new document
    client.close();
    return Promise.resolve(contestant.value);
  } catch (e) {
    return Promise.reject(e);
  }
};

exports.getContestants = async (guildId) => {
  try {
    const client = await MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }); // Connect to Mongo client
    const collection = client.db(process.env.MONGO_DATABASE).collection(process.env.MONGO_CONTESTANT_COLLECTION); // Find database and collection
    const contestants = await collection.find(
      { server_id: guildId }
    ).sort({ score: -1 }).toArray(); // Find all contestants for a specific server
    client.close();
    return Promise.resolve(contestants);
  } catch (e) {
    return Promise.reject(e);
  }
};
