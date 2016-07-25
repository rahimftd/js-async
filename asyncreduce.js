const asyncMap = require('./asyncmap');


const asyncReduce = (funcArray, reduceFunc, start, callback) => {
  let currFuncIndex = 0;
  let previous = start;
  let reduceCallback = (curr) => {
    previous = reduceFunc(previous, curr, currFuncIndex, funcArray);
    if (++currFuncIndex === funcArray.length) {
      callback(previous);
    } else {
      funcArray[currFuncIndex](reduceCallback);
    }
  }
  funcArray[currFuncIndex](reduceCallback);
}

// This version of asyncReduce makes use of asyncMap
const asyncReduceUsingMap = (funcArray, reduceFunc, start, callback) => {
  asyncMap(funcArray, (mappedArray) => {
    callback(mappedArray.reduce(reduceFunc, start));
  });
};

module.exports = asyncReduce;