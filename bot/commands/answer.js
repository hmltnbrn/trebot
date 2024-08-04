const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
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
    .addStringOption((option) =>
      option.setName('submission').setDescription('The user answer'),
    ),
  async execute(interaction) {
    const { options, channelId, member, guildId } = interaction;

    const submission = options.getString('submission');
    const { answer, value, clues } = await storage.getItem(channelId);

    if (!answer) {
      return await interaction.reply('You need a question first, honey.');
    }

    const turndownService = new TurndownService();
    const markdown = turndownService.turndown(answer);

    if (!submission) {
      const embed = new EmbedBuilder()
        .setColor('#060CE9')
        .setTitle('Beep beep beep!')
        .setDescription(markdown);

      await storage.setItem(channelId, {});

      return await interaction.reply({ embeds: [embed] });
    }

    const contestantAnswer = submission.toLowerCase();
    const stringAnswer = removeMd(markdown).toLowerCase();
    const similarity = stringSimilarity.compareTwoStrings(
      stringAnswer,
      contestantAnswer,
    );
    const clueAmount = clues.length || 0;

    if (
      stringAnswer === contestantAnswer ||
      similarity >= 0.6 ||
      helpers.checkPartial(stringAnswer.split(' '), contestantAnswer.split(' '))
    ) {
      const valuePerc = 0.25 * (4 - clueAmount);
      const givenValue = clueAmount > 0 ? value * valuePerc : value;
      const { score } = await db.increaseContestantScore(
        guildId,
        member,
        givenValue,
      );

      const embed = new EmbedBuilder()
        .setColor('#4CAF50')
        .setTitle(`${member.displayName} is correct!`)
        .setDescription(`The answer is "${markdown}"`)
        .setFields([
          {
            name: '-----------',
            value: `${member.displayName}'s cash winnings are now $${score.toLocaleString()}`,
          },
        ])
        .setFooter({
          text: `Awarded $${givenValue.toLocaleString()} for the correct answer`,
        });

      await storage.setItem(channelId, {});

      return await interaction.reply({ embeds: [embed] });
    }
    const { score } = await db.decreaseContestantScore(guildId, member, value);

    const embed = new EmbedBuilder()
      .setColor('#F44336')
      .setTitle(`Sorry, ${member.displayName}, that's incorrect.`)
      .setDescription(`The answer is not "${contestantAnswer}"`)
      .setFields([
        {
          name: '-----------',
          value: `${member.displayName}'s cash winnings are now $${score.toLocaleString()}`,
        },
      ])
      .setFooter({
        text: `Took away $${value.toLocaleString()} for the incorrect answer`,
      });

    return await interaction.reply({ embeds: [embed] });
  },
};
