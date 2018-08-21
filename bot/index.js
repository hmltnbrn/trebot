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

client.on('message', async msg => {

  if(msg.author.bot) return;

  if(msg.content.indexOf(process.env.BOT_PREFIX) !== 0) return;

  const args = msg.content.slice(process.env.BOT_PREFIX.length).trim().split(/ +/g).map(arg => arg.toLowerCase());
  const command = args.shift().toLowerCase();

  if(command !== "!trebot" && command !== "!tre" && command !== "t") return;

  if(args[0] === 'question' || args[0] === 'q') {
    try {
      var {answer, log} = await commands.question(msg.channel, args);
      randomAnswer[msg.channel.id] = answer;
    } catch (e) {
      var log = e;
    }
    logger.info(log);
  }

  else if (args[0] === 'answer' || args[0] === 'a') {
    try {
      var log = await commands.answer(msg.channel, randomAnswer[msg.channel.id]);
      randomAnswer[msg.channel.id] = "";
    } catch (e) {
      var log = e;
    }
    logger.info(log);
  }

  else if (args[0] === 'help') {
    try {
      var log = await commands.help(msg.channel);
    } catch (e) {
      var log = e;
    }
    logger.info(log);
  }

  else {
    msg.channel.send("Not a command, honey.");
    logger.info("Failed command");
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
