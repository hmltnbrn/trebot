const moment = require('moment');
const upndown = require('upndown');

const db = require('../../db');

module.exports = function(channel, args, cb) {
  db.getRandomQuestion(function(data, err) {
    if(err) {
      channel.send("There was an error. Talk to my creater.");
      logger.info(err);
    }
    let und = new upndown();
    und.convert(data.question, function(err, markdown) {
      if(err) { console.err(err); }
      else {
        channel.send({embed: {
          color: 58,
          title: `${data.category} for ${data.value || 'the whole ballgame'}`,
          description: data.round,
          fields: [{
            name: "-".repeat(data.round.length),
            value: markdown
          }],
          footer: {
            text: `${moment(data.air_date).format("MMMM Do, YYYY")} (Season ${data.season} -- Episode #${data.show_number})`
          }
        }});
      }
    });
    if(args[2] === '20' || args[2] === '30') {
      setTimeout(() => {
        channel.send(data.answer);
        return cb(data.answer, "Responding with question and answer");
      }, parseInt(args[2])*1000);
    }
    else {
      return cb(data.answer, "Responding with question");
    }
  });
}
