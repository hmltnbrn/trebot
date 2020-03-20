const TurndownService = require('turndown')

module.exports = async (channel, answer) => {
  if(answer) {
    var turndownService = new TurndownService();
    var markdown = turndownService.turndown(answer); // Convert HTML to markdown
    channel.send({embed: {
      color: 0x060CE9,
      title: "Beep beep beep!",
      description: markdown
    }});
    return Promise.resolve("Responding with answer");
  }
  else {
    channel.send("You need a question first, honey.");
    return Promise.resolve("No saved question");
  }
}
