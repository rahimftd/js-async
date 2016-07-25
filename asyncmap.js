
const asyncMap = (funcArr, callback) => {
  const output = [];
  let outputLength = 0;
  // Iterate through array of functions
    // Call each function, passing in callback
  for (let i = 0; i < funcArr.length; i++) {
    funcArr[i]((results) => {
      output[i] = results;
      outputLength++;
      if (outputLength === funcArr.length) callback(output);
    });
  }
};

module.exports = asyncMap;