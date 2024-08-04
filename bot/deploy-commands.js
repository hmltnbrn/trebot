const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes } = require('discord.js');

require('dotenv').config();

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    );

    // For singular guild usage
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.BOT_CLIENT_ID,
        process.env.GUILD_ID,
      ),
      { body: commands },
    );

    // For global usage
    // await rest.put(
    //   Routes.applicationCommands(process.env.BOT_CLIENT_ID),
    //   { body: commands },
    // );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
