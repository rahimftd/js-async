const asyncMap = require('./asyncmap');

const asyncFilter = (funcArray, filterFunc, callback) => {
  asyncMap(funcArray, (mappedArray) => {
    var output = [];
    mappedArray.forEach((value, index, array) => {
      if (value % 2 === 1) output.push(value);
    });
    callback(output);
  });
}

module.exports = asyncFilter;
