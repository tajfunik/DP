import vocabulary from 'assets/vocabulary';

import {
  splitTextIntoArray,
  removeStopWords,
  removeDetails,
  lettersToLowerCase,
} from 'utils/parsing';

const getScoreOfArticle = articleToParse => {
  // slova do pola
  let result = splitTextIntoArray(articleToParse);

  // stopove slova
  result = removeStopWords(result);

  // zvysne medzery a necitatelne znaky
  result = removeDetails(result);

  // slova na male pismena
  result = lettersToLowerCase(result);

  const score = result.reduce((prev, word) => {
    const match = vocabulary.filter(vocabWord => word === vocabWord.word);

    // vypis najdenych slov zo slovnika
    // if (match.length) {
    //   console.log(match);
    // }

    if (match.length !== 0) {
      const scoreForMatch = prev += match[0].rating;
      return scoreForMatch;
    }

    return prev;
  }, 0);

  // console.log(`Finálne skóre: ${score}`); // eslint-disable-line
  const finalScore = (1 + Math.log10(Math.abs(score))).toFixed(2);
  if (score < 0) {
    return -finalScore; // eslint-disable-line
  }
    return finalScore; // eslint-disable-line
};

export { getScoreOfArticle };
