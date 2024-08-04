const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dayjs = require('dayjs');
const advancedFormat = require('dayjs/plugin/advancedFormat');
const TurndownService = require('turndown');
const storage = require('node-persist');

const db = require('../../db');

dayjs.extend(advancedFormat);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('question')
    .setDescription('Alex Trebot reading you a question'),
  async execute(interaction) {
    const { channelId } = interaction;

    const {
      category,
      value,
      link,
      round,
      air_date,
      season,
      answer,
      show_number,
      question,
    } = await db.getRandomQuestion();
    const turndownService = new TurndownService();
    const markdown = turndownService.turndown(question);

    const embed = new EmbedBuilder()
      .setColor('#060CE9')
      .setTitle(`${category} for ${value ? '$' + value : 'the whole ballgame'}`)
      .setURL(link)
      .setDescription(round)
      .setFields([
        {
          name: '-'.repeat(round.length),
          value: markdown,
        },
      ])
      .setFooter({
        text: `${dayjs(air_date).format(
          'MMMM Do, YYYY',
        )} (Season ${season} -- Episode #${show_number})`,
      });

    await storage.setItem(channelId, {
      answer,
      value: value || 1000,
      clues: [],
    });
    return await interaction.reply({ embeds: [embed] });
  },
};
