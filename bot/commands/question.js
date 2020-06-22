const moment = require('moment');
const upndown = require('upndown');

const db = require('../../db');

module.exports = async (channel, args) => {
  try {
    const question = await db.getRandomQuestion(); // Get random question from Mongo questionbase
    let und = new upndown();
    und.convert(question.question, (err, markdown) => { // Convert HTML to markdown
      if(err) {
        return Promise.reject(err);
      }
      else {
        channel.send({embed: {
          color: 0x060CE9,
          title: `${question.category} for ${question.value ? "$" + question.value : 'the whole ballgame'}`,
          description: question.round,
          fields: [{
            name: "-".repeat(question.round.length),
            value: markdown
          }],
          footer: {
            text: `${moment(question.air_date).format("MMMM Do, YYYY")} (Season ${question.season} -- Episode #${question.show_number})`
          },
          url: question.link
        }});
      }
    });
    if(args[1] === '20' || args[1] === '30') { // Check for answer timer
      return await new Promise(resolve => {
        setTimeout(() => {
          channel.send(question.answer);
          return resolve({ answer: "", value: 0, log: "Responding with question and answer" })
        }, parseInt(args[1])*1000);
      });
    }
    else {
      return Promise.resolve({ answer: question.answer, value: question.value || 1000, log: "Responding with question" });
    }
  } catch (e) {
    return Promise.reject(e);
  }
}
