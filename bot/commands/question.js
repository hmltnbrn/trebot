const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require('moment');
const TurndownService = require('turndown');
const storage = require('node-persist');

const db = require('../../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('question')
    .setDescription('Alex Trebot reading you a question'),
  async execute(interaction) {
    const question = await db.getRandomQuestion();
    const turndownService = new TurndownService();
    const markdown = turndownService.turndown(question.question);

    const embed = new EmbedBuilder()
      .setColor('#060CE9')
      .setTitle(`${question.category} for ${question.value ? '$' + question.value : 'the whole ballgame'}`)
      .setURL(question.link)
      .setDescription(question.round)
      .setFields([{
        name: '-'.repeat(question.round.length),
        value: markdown,
      }])
      .setFooter({ text: `${moment(question.air_date).format('MMMM Do, YYYY')} (Season ${question.season} -- Episode #${question.show_number})` });

    await storage.setItem(interaction.channelId, { answer: question.answer, value: question.value || 1000, clues: [] });
    return await interaction.reply({ embeds: [embed] });
  },
};
