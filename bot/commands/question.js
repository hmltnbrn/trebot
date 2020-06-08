const moment = require('moment');
const upndown = require('upndown');

const db = require('../../db');

module.exports = async (channel, args) => {
  try {
    const question = await db.getRandomQuestion(); // Get random question from Mongo questionbase
    let valueNumber = 0;
    if(question.value && question.value[0] === 'D') {
      valueNumber = parseInt(question.value.replace('DD: $', '').replace(',', ''));
    }
    else {
      valueNumber = question.value ? parseInt(question.value.replace('$', '').replace(',', '')) : 1000;
    }
    let und = new upndown();
    und.convert(question.question, (err, markdown) => { // Convert HTML to markdown
      if(err) {
        return Promise.reject(err);
      }
      else {
        channel.send({embed: {
          color: 0x060CE9,
          title: `${question.category} for ${question.value || 'the whole ballgame'}`,
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
      return Promise.resolve({ answer: question.answer, value: isNaN(valueNumber) ? 0 : valueNumber, log: "Responding with question" });
    }
  } catch (e) {
    return Promise.reject(e);
  }
}
