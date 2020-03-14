const helpText = `Welcome to Trebot! I can help you play Jeopardy.

${process.env.BOT_PREFIX || '.'}trebot [q]uestion [20|30] ............ Question with optional 20 or 30 second timer
${process.env.BOT_PREFIX || '.'}trebot [a]nswer <answer text> ... Try to answer previous non-timed question (will reveal answer and increase the score for the contestant if answered correctly/decrease if answered incorrectly)
${process.env.BOT_PREFIX || '.'}trebot [a]nswer ............................... Answer to previously asked question
${process.env.BOT_PREFIX || '.'}trebot [s]core .................................. Get the score of the server's game`;

module.exports = async channel => {
  channel.send(helpText);
  return Promise.resolve("Responding with help");
}
