const upndown = require('upndown');

module.exports = async (channel, answer) => {
  if(answer) {
    let und = new upndown();
    und.convert(answer, function(err, markdown) { // Convert HTML to markdown
      if(err) {
        return Promise.reject(err);
      }
      else {
        channel.send(markdown);
      }
    });
    return Promise.resolve("Responding with answer");
  }
  else {
    channel.send("You need a question first, honey.");
    return Promise.resolve("No saved question");
  }
}
