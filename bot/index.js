const Discord = require('discord.js');
const logger = require('winston');

let commands = require('./commands');

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
  colorize: true
});
logger.level = 'debug';

const client = new Discord.Client();

client.on('ready', () => {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(client.user.username + ' - (' + client.user.id + ')');
});

let randomAnswer = {};

client.on('message', msg => {

  if(msg.author.id !== process.env.BOT_ID && msg.content[0] === "!") {

    var args = msg.content.split(" "); // split arguments into array

    if((args[0].toLowerCase() === "!trebot" || args[0].toLowerCase() === "!tre" || args[0].toLowerCase() === "!t") && args[1]) {

      if(args[1].toLowerCase() === 'question' || args[1].toLowerCase() === 'q') {
        commands.question(msg.channel, args, (answer, log) => {
          randomAnswer[msg.channel.id] = answer;
          logger.info(log);
        });
      }

      else if (args[1].toLowerCase() === 'answer' || args[1].toLowerCase() === 'a') {
        commands.answer(msg.channel, randomAnswer[msg.channel.id], (log) => {
          randomAnswer[msg.channel.id] = "";
          logger.info(log);
        });
      }

      else if (args[1].toLowerCase() === 'help') {
        commands.help(msg.channel, (log) => {
          logger.info(log);
        });
      }

      else if (["lonely", "!lonely"].indexOf(args[1].toLowerCase()) >= 0) {
        msg.channel.send("Shut up and play, honey.");
        logger.info("Lonely command");
      }

      else {
        msg.channel.send("Not a command, honey.");
        logger.info("Failed command");
      }

    }

    else if(args[0].toLowerCase() === "!johnny" && args[1]) {
      msg.channel.send("You must be thinking of the old guy. Try !trebot instead, honey.");
      logger.info("Old command");
    }

  }
});

client.login(process.env.BOT_TOKEN);

//Automatically reconnect if the bot disconnects due to inactivity
client.on('disconnect', err => {
  logger.info('Bot disconnected');
  logger.info('For reason');
  logger.info(err);
  client.login(process.env.BOT_TOKEN);
});
