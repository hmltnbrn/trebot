const Discord = require('discord.js');
const commands = require('./commands');
const asyncWrap = require('../middleware').asyncWrap;

const client = new Discord.Client();

client.on('ready', () => {
  console.log('Connected');
  console.log('Logged in as: ');
  console.log(`${client.user.username} - (${client.user.id})`);
});

const prefix = process.env.BOT_PREFIX || "!"; // Use env var for prefix or default to exclamation

let randomAnswer = {}; // Random answer object (can hold answers for multiple servers)

const allowedStartingCommands = ['trebot', 'tre', 't']; // Allowed commands for initiating the bot

client.on('message', asyncWrap(async msg => {

  if(msg.author.bot) return; // Don't allow bot to respond to itself or other bots

  if(msg.content.indexOf(prefix) !== 0) return; // Check for message prefix that initiates bot

  // Parses message for command and arguments
  const args = msg.content.slice(prefix.length).trim().split(/ +/g).map(arg => arg.toLowerCase());
  const command = args.shift().toLowerCase();

  if(allowedStartingCommands.indexOf(command) < 0) return;

  // Ask a question
  if(args[0] === 'question' || args[0] === 'q') {
    var { answer, log } = await commands.question(msg.channel, args);
    randomAnswer[msg.channel.id] = answer;
    console.log(log);
  }

  // Get an answer
  else if (args[0] === 'answer' || args[0] === 'a') {
    if(args[1]) { // If a user supplied an answer
      var { log, reset } = await commands.contestantAnswer(msg.channel, randomAnswer[msg.channel.id], msg.member.displayName, args.slice(1).join(' '));
      if(reset) randomAnswer[msg.channel.id] = "";
    }
    else {
      var log = await commands.answer(msg.channel, randomAnswer[msg.channel.id]);
      randomAnswer[msg.channel.id] = "";
    }
    console.log(log);
  }

  // Ask for help
  else if (args[0] === 'help') {
    var log = await commands.help(msg.channel);
    console.log(log);
  }

  // Not a command
  else {
    msg.channel.send("Not a command, honey.");
    console.log("Failed command");
  }

}, (e) => {
  console.error(e); // Will display the error message if there is one
}));

client.login(process.env.BOT_TOKEN);

// Automatically reconnect if the bot disconnects due to inactivity
client.on('disconnect', err => {
  console.log('Bot disconnected');
  console.log('For reason');
  console.error(err);
  client.login(process.env.BOT_TOKEN);
});
