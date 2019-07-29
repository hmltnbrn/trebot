const helpText = `Welcome to Trebot! I can help you play Jeopardy.

!trebot [q]uestion [20|30] ............ Question with optional 20 or 30 second timer
!trebot [a]nswer <answer text> ... Try to answer previous non-timed question (will reveal answer once question is answered correctly)
!trebot [a]nswer ............................... Answer to previously asked question`;

module.exports = async channel => {
  channel.send(helpText);
  return Promise.resolve("Responding with help");
}
