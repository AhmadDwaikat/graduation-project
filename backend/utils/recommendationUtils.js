const natural = require('natural');

class TfidfVectorizer {
  constructor() {
    this.tfidf = new natural.TfIdf();
  }

  fit_transform(documents) {
    documents.forEach(doc => this.tfidf.addDocument(doc));
    return documents.map((_, index) =>
      this.tfidf.listTerms(index).reduce((acc, term) => {
        acc[term.term] = term.tfidf;
        return acc;
      }, {})
    );
  }

  transform(documents) {
    const tfidf = new natural.TfIdf();
    documents.forEach(doc => tfidf.addDocument(doc));
    return documents.map((_, index) =>
      tfidf.listTerms(index).reduce((acc, term) => {
        acc[term.term] = term.tfidf;
        return acc;
      }, {})
    );
  }
}

const cosineSimilarity = (vecA, vecB) => {
  const intersection = Object.keys(vecA).filter(key => key in vecB);
  const dotProduct = intersection.reduce((sum, key) => sum + vecA[key] * vecB[key], 0);
  const magnitudeA = Math.sqrt(Object.values(vecA).reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(Object.values(vecB).reduce((sum, val) => sum + val * val, 0));
  return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
};





module.exports = {
  TfidfVectorizer,
  cosineSimilarity,
};
