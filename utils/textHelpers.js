const getWordCounts = data => {
  const counts = {};
  data.map(word => (counts[word] ? counts[word]++ : (counts[word] = 1)));
  return counts;
};

const sortAndGetTopTenWords = data => {
  var sortable = [];
  for (var word in data) sortable.push({ word, output: { count: data[word] } });
  sortable.sort((a, b) => b.output.count - a.output.count);
  return sortable.slice(0, 10);
};

module.exports = {
  getWordCounts,
  sortAndGetTopTenWords
};
