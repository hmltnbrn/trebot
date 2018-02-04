var Discord = require('discord.io');
var logger = require('winston');

var commands = require('./commands');

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
  colorize: true
});
logger.level = 'debug';

var bot = new Discord.Client({
  token: process.env.BOT_TOKEN,
  autorun: true
});

bot.on('ready', function (evt) {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(bot.username + ' - (' + bot.id + ')');
});

var randomAnswer = "";

bot.on('message', function (user, userID, channelID, message, evt) {

  if(userID !== '403037678351679498' && message[0] === "!") {

    var args = message.split(" "); // split arguments into array

    if((args[0].toLowerCase() === "!trebot" || args[0].toLowerCase() === "!tre" || args[0].toLowerCase() === "!t") && args[1]) {

      if(args[1].toLowerCase() === 'question' || args[1].toLowerCase() === 'q') {
        commands.question(bot, channelID, args, function(answer, log) {
          randomAnswer = answer;
          logger.info(log);
        });
      }

      else if (args[1].toLowerCase() === 'answer' || args[1].toLowerCase() === 'a') {
        commands.answer(bot, channelID, randomAnswer, function(log) {
          randomAnswer = "";
          logger.info(log);
        });
      }

      else if (args[1].toLowerCase() === 'help') {
        commands.help(bot, channelID, function(log) {
          logger.info(log);
        });
      }

      else if (["lonely", "!lonely"].indexOf(args[1].toLowerCase()) >= 0) {
        bot.sendMessage({
          to: channelID,
          message: "Shut up and play, honey."
        });
        logger.info("Lonely command");
      }

      else {
        bot.sendMessage({
          to: channelID,
          message: "Not a command, honey."
        });
        logger.info("Failed command");
      }

    }

    else if(args[0].toLowerCase() === "!johnny" && args[1]) {
      bot.sendMessage({
        to: channelID,
        message: "You must be thinking of the old guy. Try !trebot instead, honey."
      });
      logger.info("Old command");
    }

  }
});

// Automatically reconnect if the bot disconnects due to inactivity
bot.on('disconnect', function(errMsg, code) {
  logger.info('Bot disconnected with code');
  logger.info(code);
  logger.info('For reason');
  logger.info(errMsg);
  bot.connect();
});
