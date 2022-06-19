const MongoClient = require('mongodb').MongoClient;

exports.getRandomQuestion = async () => {
  const client = await MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const collection = client.db(process.env.MONGO_DATABASE).collection(process.env.MONGO_CLUE_COLLECTION);
  // Return one random sample from collection
  const result = await collection.aggregate([
    { $sample: { size: 1 } },
  ]).toArray();
  client.close();
  return Promise.resolve(result[0]);
};

exports.increaseContestantScore = async (guildId, member, value) => {
  const client = await MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const collection = client.db(process.env.MONGO_DATABASE).collection(process.env.MONGO_CONTESTANT_COLLECTION);
  // Find contestant from specific server and increment score or create new document
  const contestant = await collection.findOneAndUpdate(
    { server_id: guildId, member_id: member.id },
    { $inc: { 'score': value, 'correct_answers': 1 }, $set: { user_tag: member.displayName } },
    { returnDocument: 'after', upsert: true },
  );
  client.close();
  return Promise.resolve(contestant.value);
};

exports.decreaseContestantScore = async (guildId, member, value) => {
  const client = await MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const collection = client.db(process.env.MONGO_DATABASE).collection(process.env.MONGO_CONTESTANT_COLLECTION);
  // Find contestant from specific server and decrement score or create new document
  const contestant = await collection.findOneAndUpdate(
    { server_id: guildId, member_id: member.id },
    { $inc: { 'score': -1 * value, 'incorrect_answers': 1 }, $set: { user_tag: member.displayName } },
    { returnDocument: 'after', upsert: true },
  );
  client.close();
  return Promise.resolve(contestant.value);
};

exports.getContestants = async (guildId) => {
  const client = await MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const collection = client.db(process.env.MONGO_DATABASE).collection(process.env.MONGO_CONTESTANT_COLLECTION);
  // Find all contestants for a specific server
  const contestants = await collection.find(
    { server_id: guildId },
  ).sort({ score: -1 }).toArray();
  client.close();
  return Promise.resolve(contestants);
};
