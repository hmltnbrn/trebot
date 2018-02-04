module.exports = function(bot, channelID, answer, cb) {
  if(answer) {
    bot.sendMessage({
      to: channelID,
      message: answer
    });
    return cb("Responding with answer");
  }
  else {
    bot.sendMessage({
      to: channelID,
      message: "You need a question first, honey."
    });
    return cb("No saved question");
  }
}
