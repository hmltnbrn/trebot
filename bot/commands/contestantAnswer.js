const TurndownService = require('turndown');
const removeMd = require('remove-markdown');
const stringSimilarity = require('string-similarity');

const db = require('../../db');

module.exports = async (channel, guild, answer, value, member, contestantAnswer) => {
  if(answer) {
    const turndownService = new TurndownService()
    const markdown = turndownService.turndown(answer); // Convert HTML to markdown
    if(contestantAnswer) {
      const stringAnswer = removeMd(markdown).toLowerCase();
      const similarity = stringSimilarity.compareTwoStrings(stringAnswer, contestantAnswer);
      if(similarity >= 0.6 || checkPartial(stringAnswer.split(' '), contestantAnswer.split(' '))) { // Check for a 60% similarity rating between the contestant's answer and the actual answer OR some words being present
        try {
          var contestant = await db.increaseContestantScore(guild.id, member, value);
        } catch (e) {
          return Promise.reject(e);
        }
        channel.send({embed: {
          color: 0x4caf50,
          title: `${member.displayName} is correct!`,
          description: `The answer is ${markdown}`,
          fields: [{
            name: "-----------",
            value: `${member.displayName}'s cash winnings are now $${contestant.score.toLocaleString()}`
          }],
          footer: {
            text: `Awarded $${value.toLocaleString()} for the correct answer`
          },
        }});
        return Promise.resolve({ log: "Responding with answer", reset: true });
      }
      try {
        var contestant = await db.decreaseContestantScore(guild.id, member, value);
      } catch (e) {
        return Promise.reject(e);
      }
      channel.send({embed: {
        color: 0xf44336,
        title: `Sorry, ${member.displayName}, that's incorrect.`,
        description: `${member.displayName}'s cash winnings are now $${contestant.score}`,
        footer: {
          text: `Took away $${value} for the incorrect answer`
        },
      }});
    }
    else {
      channel.send("There is a mistake, honey.");
      return Promise.resolve({ log: "No answer provided", reset: false });
    }
    return Promise.resolve({ log: "Responding with correctness", reset: false });
  }
  else {
    channel.send("You need a question first, honey.");
    return Promise.resolve({ log: "No saved question", reset: false });
  }
}

const checkPartial = (answerArr, contestantAnswerArr) => {
  let correctNum = 0;
  for(let i = 0; i < answerArr.length; i++) {
    for(let j = 0; j < contestantAnswerArr.length; j++) {
      if(stringSimilarity.compareTwoStrings(answerArr[i], contestantAnswerArr[j]) >= 0.8) {
        correctNum++;
      }
    }
  }
  if(correctNum === contestantAnswerArr.length) return true;
  else return false;
};
