const db = require('../../db');

module.exports = async (channel, guild) => {
  try {
    var contestants = await db.getContestants(guild.id); // Get all contestants from this server
  } catch (e) {
    return Promise.reject(e);
  }
  let scoreText = contestants.map(c => {
    const correct = +c.correct_answers || 0;
    const incorrect = +c.incorrect_answers || 0;
    const perc = (correct/(correct+incorrect)).toFixed(3).slice(1);
    return {
      name: c.user_tag,
      value: `$${c.score.toLocaleString()} (${correct}-${incorrect} ${perc})`
    }
  });
  channel.send(contestants.length === 0 ? "No one's played yet, honey." : {embed: {
    color: 0x060CE9,
    title: "Scoreboard",
    fields: scoreText
  }});
  return Promise.resolve("Responding with score");
}
