const TurndownService = require('turndown')

module.exports = async (channel, answer) => {
  if(answer) {
    var turndownService = new TurndownService()
    var markdown = turndownService.turndown(answer); // Convert HTML to markdown
    channel.send(markdown);
    return Promise.resolve("Responding with answer");
  }
  else {
    channel.send("You need a question first, honey.");
    return Promise.resolve("No saved question");
  }
}
