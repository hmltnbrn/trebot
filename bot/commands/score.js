const db = require('../../db');

module.exports = async (channel, guild) => {
  try {
    var contestants = await db.getContestants(guild.id); // Get all contestants from this server
  } catch (e) {
    return Promise.reject(e);
  }
  let scoreText = contestants.map(c => {
    return `${c.user_tag} -- $${c.score} (${c.correct_answers} correct|${c.incorrect_answers} incorrect)`;
  });
  channel.send(contestants.length > 0 ? scoreText.join('\n') : "No one's played yet, honey.");
  return Promise.resolve("Responding with score");
}
