const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const helpText = [
  {
    name: '/question',
    value: 'Random question from Jeopardy! history',
  },
  {
    name: '/clue',
    value:
      'Show up to three different clues (will remove 25% for each clue from the winning value)',
  },
  {
    name: '/answer <answer text>',
    value:
      'Try to answer previous question (will reveal answer and increase the score for the contestant if answered correctly/decrease if answered incorrectly)',
  },
  {
    name: '/answer',
    value: 'Answer to previously asked question',
  },
  {
    name: '/score',
    value: "Get the score of the server's game",
  },
  {
    name: 'GitHub repo',
    value: 'https://github.com/hmltnbrn/trebot',
  },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Stop. Get some help.'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#060CE9')
      .setTitle('Help')
      .setFields(helpText);

    return await interaction.reply({ embeds: [embed] });
  },
};
