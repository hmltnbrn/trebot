const upndown = require('upndown');

module.exports = function(channel, answer, cb) {
  if(answer) {
    let und = new upndown();
    und.convert(answer, function(err, markdown) {
      if(err) { console.err(err); }
      else {
        channel.send(markdown);
      }
    });
    return cb("Responding with answer");
  }
  else {
    channel.send("You need a question first, honey.");
    return cb("No saved question");
  }
}
