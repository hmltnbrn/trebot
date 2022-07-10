const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const TurndownService = require('turndown');
const removeMd = require('remove-markdown');
const stringSimilarity = require('string-similarity');
const storage = require('node-persist');

const db = require('../../db');
const helpers = require('../helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('answer')
    .setDescription('The judges will check if you were right')
    .addStringOption(option => option.setName('submission').setDescription('The user answer')),
  async execute(interaction) {
    const submission = interaction.options.getString('submission');
    const { answer, value, clues } = await storage.getItem(interaction.channelId);

    if (!answer) {
      return await interaction.reply('You need a question first, honey.');
    }

    const turndownService = new TurndownService();
    const markdown = turndownService.turndown(answer);

    if (!submission) {
      const embed = new MessageEmbed()
        .setColor('#060CE9')
        .setTitle('Beep beep beep!')
        .setDescription(markdown);

      await storage.setItem(interaction.channelId, {});

      return await interaction.reply({ embeds: [embed] });
    }

    const contestantAnswer = submission.toLowerCase();
    const stringAnswer = removeMd(markdown).toLowerCase();
    const similarity = stringSimilarity.compareTwoStrings(stringAnswer, contestantAnswer);
    const clueAmount = clues.length || 0;

    if (stringAnswer === contestantAnswer || similarity >= 0.6 || helpers.checkPartial(stringAnswer.split(' '), contestantAnswer.split(' '))) {
      const valuePerc = 0.25 * (4 - clueAmount);
      const givenValue = clueAmount > 0 ? value * valuePerc : value;
      const contestant = await db.increaseContestantScore(interaction.guildId, interaction.member, givenValue);

      const embed = new MessageEmbed()
        .setColor('#4CAF50')
        .setTitle(`${interaction.member.displayName} is correct!`)
        .setDescription(`The answer is "${markdown}"`)
        .setFields([{
          name: '-----------',
          value: `${interaction.member.displayName}'s cash winnings are now $${contestant.score.toLocaleString()}`,
        }])
        .setFooter({ text: `Awarded $${givenValue.toLocaleString()} for the correct answer` });

      await storage.setItem(interaction.channelId, {});

      return await interaction.reply({ embeds: [embed] });
    }
    const contestant = await db.decreaseContestantScore(interaction.guildId, interaction.member, value);

    const embed = new MessageEmbed()
      .setColor('#F44336')
      .setTitle(`Sorry, ${interaction.member.displayName}, that's incorrect.`)
      .setDescription(`The answer is not "${contestantAnswer}"`)
      .setFields([{
        name: '-----------',
        value: `${interaction.member.displayName}'s cash winnings are now $${contestant.score.toLocaleString()}`,
      }])
      .setFooter({ text: `Took away $${value.toLocaleString()} for the incorrect answer` });

    return await interaction.reply({ embeds: [embed] });
  },
};
