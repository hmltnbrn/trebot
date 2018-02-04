var moment = require('moment');

var db = require('../../db');

module.exports = function(bot, channelID, args, cb) {
  db.getRandomQuestion(function(data, err) {
    if(err) {
      bot.sendMessage({
        to: channelID,
        message: "There was an error. Talk to John Wayne."
      });
      logger.info(err);
    }
    bot.sendMessage({
      to: channelID,
      message: `${moment(data.air_date).format("MMMM Do, YYYY")} (Episode #${data.show_number})\n${data.round}\n${data.category} for ${data.value || 'the whole ballgame'}\n${data.question}`
    });
    if(args[2] === '20' || args[2] === '30') {
      setTimeout(() => {
        bot.sendMessage({
          to: channelID,
          message: data.answer
        });
        return cb(data.answer, "Responding with question and answer");
      }, parseInt(args[2])*1000);
    }
    else {
      return cb(data.answer, "Responding with question");
    }
  });
}
