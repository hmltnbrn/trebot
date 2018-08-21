const moment = require('moment');
const upndown = require('upndown');

const db = require('../../db');

module.exports = async (channel, args) => {
  try {
    var data = await db.getRandomQuestion();
  } catch (e) {
    return Promise.reject(e);
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
        },
        url: data.link
      }});
    }
  });
  if(args[2] === '20' || args[2] === '30') {
    setTimeout(() => {
      channel.send(data.answer);
      return Promise.resolve({answer: data.answer, log: "Responding with question and answer"});
    }, parseInt(args[2])*1000);
  }
  else {
    return Promise.resolve({answer: data.answer, log: "Responding with question"});
  }
}
