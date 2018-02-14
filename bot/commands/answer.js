module.exports = function(channel, answer, cb) {
  if(answer) {
    channel.send(answer);
    return cb("Responding with answer");
  }
  else {
    channel.send("You need a question first, honey.");
    return cb("No saved question");
  }
}
