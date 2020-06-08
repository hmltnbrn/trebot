const Discord = require('discord.js');
const commands = require('./commands');

const client = new Discord.Client();

client.on('ready', () => {
  console.log('Connected');
  console.log('Logged in as: ');
  console.log(`${client.user.username} - (${client.user.id})`);
});

const prefix = process.env.BOT_PREFIX || "."; // Use env var for prefix or default to exclamation

const currentAnswer = {}; // Current answer object (can hold answers for multiple servers)

const allowedStartingCommands = ['trebot', 'tre', 't']; // Allowed commands for initiating the bot

client.on('message', async msg => {
  try {
    if(msg.author.bot) return; // Don't allow bot to respond to itself or other bots

    if(msg.content.indexOf(prefix) !== 0) return; // Check for message prefix that initiates bot

    // Parses message for command and arguments
    const args = msg.content.slice(prefix.length).trim().split(/ +/g).map(arg => arg.toLowerCase());
    const command = args.shift().toLowerCase();

    if(allowedStartingCommands.indexOf(command) < 0) return;

    // Ask a question
    if(args[0] === 'question' || args[0] === 'q') {
      const { answer, value, log } = await commands.question(msg.channel, args);
      currentAnswer[msg.channel.id] = { answer, value };
      console.log(log);
    }

    // Get an answer
    else if (args[0] === 'answer' || args[0] === 'a') {
      if(args[1]) { // If a user supplied an answer
        const { log, reset } = await commands.contestantAnswer(msg.channel, msg.guild, currentAnswer[msg.channel.id].answer, currentAnswer[msg.channel.id].value, msg.member, args.slice(1).join(' '));
        if(reset) currentAnswer[msg.channel.id] = "";
        console.log(log);
      }
      else {
        const log = await commands.answer(msg.channel, currentAnswer[msg.channel.id].answer);
        currentAnswer[msg.channel.id] = "";
        console.log(log);
      }
    }

    else if(args[0] === 'score' || args[0] === 's') {
      const log = await commands.score(msg.channel, msg.guild);
      console.log(log);
    }

    // Ask for help
    else if (args[0] === 'help' || args[0] === 'h') {
      const log = await commands.help(msg.channel);
      console.log(log);
    }

    // Not a command
    else {
      msg.channel.send("Not a command, honey.");
      console.log("Failed command");
    }

  } catch (e) {
    msg.channel.send("There's been an error, honey.");
    console.error(e); // Will display the error message if there is one
  }
});

client.login(process.env.BOT_TOKEN);

// Automatically reconnect if the bot disconnects due to inactivity
client.on('disconnect', err => {
  console.log('Bot disconnected');
  console.log('For reason');
  console.error(err);
  client.login(process.env.BOT_TOKEN);
});
