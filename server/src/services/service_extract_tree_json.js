function extractTreeJson(str, startWord, endWord) {
  const startIndex = str.indexOf(startWord);
  if (startIndex === -1) {
    // Start word not found
    return "";
  }

  const endIndex = str.indexOf(endWord, startIndex + startWord.length);
  if (endIndex === -1) {
    // End word not found
    return "";
  }

  return str.substring(startIndex + startWord.length, endIndex).trim();
}

module.exports = { extractTreeJson };
