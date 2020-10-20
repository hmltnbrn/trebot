module.exports = async (channel, answer, currentClues, clueNumber) => {
  if(answer) {
    const clueNames = ["Number of Words", "Shuffled Letters", "Revealed Letters"];
    const answerText = removeTags(answer);
    if(clueNumber === 1) {
      currentClues.push(numberOfWords(answerText));
    }
    else if(clueNumber === 2) {
      currentClues.push(shuffleLetters(answerText));
    }
    else if(clueNumber === 3) {
      currentClues.push(revealLetters(answerText, 3));
    }
    const clueText = currentClues.map((clue, index) => {
      return {
        name: clueNames[index],
        value: clue
      }
    });
    channel.send({embed: {
      color: 0x060CE9,
      title: "Clues",
      fields: clueText
    }});
    return Promise.resolve("Responding with clue");
  }
  else {
    channel.send("You need a question first, honey.");
    return Promise.resolve("No saved question");
  }
}

// Remove HTML tags from string
const removeTags = (str) => {
  return str.replace( /(<([^>]+)>)/ig, '');
};

// Tell number of words in a string
const numberOfWords = (str) => {
  const arrWords = str.split(" ");
  return `There ${arrWords.length > 1 ? 'are' : 'is'} ${arrWords.length} word${arrWords.length > 1 ? 's' : ''} in the answer`;
}

// Shuffle letters around in words in a string
const shuffleLetters = (str) => {
	const arrWords = str.split(" ");
  const result = [];
  for(let i=0; i<arrWords.length; i++) {
    let a = arrWords[i].split("");
    let n = a.length;
    for(let j = n - 1; j > 0; j--) {
        let k = Math.floor(Math.random() * (j + 1));
        let tmp = a[j];
        a[j] = a[k];
        a[k] = tmp;
    }
    result.push(a.join(""));
  }
  return result.join(" ");
};

// Reveal letters in every index position (showIndex number)
const revealLetters = (str, showIndex) => {
  const arrWords = str.split(" ");
  const result = [];
  for(let i=0; i<arrWords.length; i++) {
    const splitStr = arrWords[i].split("");
    let newStr = "";
    for(let j=0; j<splitStr.length; j++) {
      newStr += j%showIndex === 0 ? splitStr[j] : '#';
    }
    result.push(newStr);
  }
  return result.join(" ");
};