const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const db = require('../../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('score')
    .setDescription('The score of the game'),
  async execute(interaction) {
    const { guildId } = interaction;

    const contestants = await db.getContestants(guildId);

    const scoreText = contestants.map((c) => {
      const correct = +c.correct_answers || 0;
      const incorrect = +c.incorrect_answers || 0;
      const perc = (correct / (correct + incorrect)).toFixed(3);
      return {
        name: c.user_tag,
        value: `$${c.score.toLocaleString()} (${correct}-${incorrect} | ${perc[0] === '1' ? perc : perc.slice(1)})`,
      };
    });

    if (contestants.length === 0) {
      return await interaction.reply("No one's played yet, honey.");
    }

    const embed = new EmbedBuilder()
      .setColor('#060CE9')
      .setTitle('Scoreboard')
      .setFields(scoreText);

    return await interaction.reply({ embeds: [embed] });
  },
};
