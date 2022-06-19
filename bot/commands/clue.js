const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const storage = require('node-persist');

const helpers = require('../helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clue')
    .setDescription('A clue to help you out'),
  async execute(interaction) {
    const { answer, value, clues } = await storage.getItem(interaction.channelId);
    const currentClues = clues || [];
    const clueNumber = currentClues.length + 1;

    if (answer) {
      const clueNames = ['Shuffled Letters', 'Revealed Letters', 'More Revealed Letters'];
      const answerText = helpers.removeTags(answer);

      if (clueNumber === 1) {
        currentClues.push(helpers.shuffleLetters(answerText));
      } else if (clueNumber === 2) {
        currentClues.push(helpers.revealLetters(answerText, 3));
      } else if (clueNumber === 3) {
        currentClues.push(helpers.revealLetters(answerText, 2));
      }

      const clueText = currentClues.map((clue, index) => {
        return {
          name: clueNames[index],
          value: clue,
        };
      });

      const embed = new MessageEmbed()
        .setColor('#060CE9')
        .setTitle('Clues')
        .setFields(clueText);

      await storage.setItem(interaction.channelId, { answer: answer, value: value, clues: currentClues });

      return await interaction.reply({ embeds: [embed] });
    } else {
      return await interaction.reply('You need a question first, honey.');
    }
  },
};
