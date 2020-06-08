const db = require('../../db');

module.exports = async (channel, guild) => {
  try {
    const contestants = await db.getContestants(guild.id); // Get all contestants from this server
    const scoreText = contestants.map(c => {
      const correct = +c.correct_answers || 0;
      const incorrect = +c.incorrect_answers || 0;
      const perc = (correct/(correct+incorrect)).toFixed(3);
      return {
        name: c.user_tag,
        value: `$${c.score.toLocaleString()} (${correct}-${incorrect} | ${perc[0] === '1' ? perc : perc.slice(1)})`
      }
    });
    channel.send(contestants.length === 0 ? "No one's played yet, honey." : {embed: {
      color: 0x060CE9,
      title: "Scoreboard",
      fields: scoreText
    }});
    return Promise.resolve("Responding with score");
  } catch (e) {
    return Promise.reject(e);
  }
}
