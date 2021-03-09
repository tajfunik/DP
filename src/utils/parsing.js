import stopwords from 'stopwords-sk';

const splitTextIntoArray = text => text.split(' ');

const removeStopWords = text =>
  text.filter(word => stopwords.indexOf(word) === -1);

const removeDetails = arr => arr.map(word =>
  word
    .replace(',', '')
    .replace('.', '')
    .replace('!', '')
    .replace('—', '')
    .replace('/\r?\n|\r/g', ''));

const lettersToLowerCase = arr => arr.map(word =>
  word.toLowerCase());

export {
  splitTextIntoArray,
  removeStopWords,
  removeDetails,
  lettersToLowerCase,
};
