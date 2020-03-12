const TurndownService = require('turndown');
const removeMd = require('remove-markdown');
const stringSimilarity = require('string-similarity');

const db = require('../../db');

module.exports = async (channel, guild, answer, value, member, contestantAnswer) => {
  if(answer) {
    var turndownService = new TurndownService()
    var markdown = turndownService.turndown(answer); // Convert HTML to markdown
    if(contestantAnswer) {
      var stringAnswer = removeMd(markdown).toLowerCase();
      var similarity = stringSimilarity.compareTwoStrings(stringAnswer, contestantAnswer);
      if(similarity >= 0.6 || checkPartial(stringAnswer.split(' '), contestantAnswer.split(' '))) { // Check for a 60% similarity rating between the contestant's answer and the actual answer OR some words being present
        try {
          var contestant = await db.setContestantScore(guild.id, member, value);
        } catch (e) {
          return Promise.reject(e);
        }
        channel.send({embed: {
          color: 58,
          title: `${member.displayName} is correct!`,
          description: `The answer is ${markdown}`,
          fields: [{
            name: "-----------",
            value: `${member.displayName}'s cash winnings are now $${contestant.score}`
          }],
          footer: {
            text: `Awarded $${value} for the correct answer`
          },
        }});
        return Promise.resolve({ log: "Responding with answer", reset: true });
      }
      channel.send(`Sorry, ${member.displayName}, that's incorrect.`);
    }
    else {
      channel.send("The is a mistake, honey.");
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
  var correctNum = 0;
  for(var i = 0; i < answerArr.length; i++) {
    for(var j = 0; j < contestantAnswerArr.length; j++) {
      if(answerArr[i] === contestantAnswerArr[j]) {
        correctNum++;
      }
    }
  }
  if(correctNum === contestantAnswerArr.length) return true;
  else return false;
};
