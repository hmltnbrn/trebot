const stringSimilarity = require('string-similarity');

// Check contestant answer against real answer
exports.checkPartial = (answerArr, contestantAnswerArr) => {
  let correctNum = 0;
  for (let i = 0; i < answerArr.length; i++) {
    for (let j = 0; j < contestantAnswerArr.length; j++) {
      if (stringSimilarity.compareTwoStrings(answerArr[i], contestantAnswerArr[j]) >= 0.8) {
        correctNum++;
      }
    }
  }
  if (correctNum === contestantAnswerArr.length) return true;
  else return false;
};

// Remove HTML tags from string
exports.removeTags = (str) => {
  return str.replace(/(<([^>]+)>)/ig, '');
};

// Tell number of words in a string
exports.numberOfWords = (str) => {
  const arrWords = str.split(' ');
  return `There ${arrWords.length > 1 ? 'are' : 'is'} ${arrWords.length} word${arrWords.length > 1 ? 's' : ''} in the answer`;
};

// Shuffle letters around in words in a string
exports.shuffleWordLetters = (str) => {
  const arrWords = str.split(' ');
  const result = [];
  for (let i = 0; i < arrWords.length; i++) {
    const a = arrWords[i].split('');
    const n = a.length;
    for (let j = n - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      const tmp = a[j];
      a[j] = a[k];
      a[k] = tmp;
    }
    result.push(a.join(''));
  }
  return result.join(' ');
};

// Shuffle letters around in an entire string
exports.shuffleLetters = (str) => {
  const a = str.split('');
  const n = a.length;
  for (let j = n - 1; j > 0; j--) {
    const k = Math.floor(Math.random() * (j + 1));
    const tmp = a[j];
    a[j] = a[k];
    a[k] = tmp;
  }
  return a.join('').toLowerCase().trim();
};

// Reveal letters in every index position (showIndex number)
exports.revealLetters = (str, showIndex) => {
  const arrWords = str.split(' ');
  const result = [];
  for (let i = 0; i < arrWords.length; i++) {
    const splitStr = arrWords[i].split('');
    let newStr = '';
    for (let j = 0; j < splitStr.length; j++) {
      newStr += j % showIndex === 0 ? splitStr[j] : '#';
    }
    result.push(newStr);
  }
  return result.join(' ');
};
