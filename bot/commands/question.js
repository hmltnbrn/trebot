const moment = require('moment');
const upndown = require('upndown');

const db = require('../../db');

module.exports = async (channel, args) => {
  try {
    var data = await db.getRandomQuestion(); // Get random question from Mongo database
  } catch (e) {
    return Promise.reject(e);
  }
  let und = new upndown();
  und.convert(data.question, function(err, markdown) { // Convert HTML to markdown
    if(err) {
      return Promise.reject(err);
    }
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
        },
        url: data.link
      }});
    }
  });
  if(args[1] === '20' || args[1] === '30') { // Check for answer timer
    return await new Promise(resolve => {
      setTimeout(() => {
        channel.send(data.answer);
        return resolve({answer: "", log: "Responding with question and answer"})
      }, parseInt(args[1])*1000);
    });
  }
  else {
    return Promise.resolve({answer: data.answer, log: "Responding with question"});
  }
}
