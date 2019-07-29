const TurndownService = require('turndown')
const removeMd = require('remove-markdown');
const stringSimilarity = require('string-similarity');

module.exports = async (channel, answer, username, contestantAnswer) => {
  if(answer) {
    var turndownService = new TurndownService()
    var markdown = turndownService.turndown(answer); // Convert HTML to markdown
    if(contestantAnswer) {
      var similarity = stringSimilarity.compareTwoStrings(removeMd(markdown).toLowerCase(), contestantAnswer);
      if(similarity >= 0.6) { // Check for an 60% similarity rating between the contestant's answer and the actual answer
        channel.send(`${username} is correct! The answer is ${markdown}`);
        return Promise.resolve({ log: "Responding with answer", reset: true });
      }
      channel.send(`Sorry, ${username}, that's incorrect.`);
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
