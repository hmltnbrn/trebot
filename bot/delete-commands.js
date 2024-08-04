const { REST, Routes } = require('discord.js');

require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log(`Started deleting all application (/) commands.`);

    // For singular guild usage
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.BOT_CLIENT_ID,
        process.env.GUILD_ID,
      ),
      { body: [] },
    );

    // For global usage
    // await rest.put(
    //   Routes.applicationCommands(process.env.BOT_CLIENT_ID),
    //   { body: [] },
    // );

    console.log('Successfully deleted application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
