const prefix = process.env.BOT_PREFIX || '.';
const helpText = [
  {
    name: `${prefix}trebot [q]uestion <20|30>`,
    value: 'Question with optional 20 or 30 second timer'
  },
  {
    name: `${prefix}trebot [c]lue`,
    value: 'Option to show up to three different clues (will remove 25% for each clue from the winning value)'
  },
  {
    name: `${prefix}trebot [a]nswer <answer text>`,
    value: 'Try to answer previous non-timed question (will reveal answer and increase the score for the contestant if answered correctly/decrease if answered incorrectly)'
  },
  {
    name: `${prefix}trebot [a]nswer`,
    value: 'Answer to previously asked question'
  },
  {
    name: `${prefix}trebot [s]core`,
    value: 'Get the score of the server\'s game'
  }
];

module.exports = async channel => {
  channel.send({embed: {
    color: 0x060CE9,
    title: "Help",
    fields: helpText
  }});
  return Promise.resolve("Responding with help");
}
