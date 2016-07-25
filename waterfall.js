const waterfall = (tasks, callback, errorCallback) => {
  let currTask = 0;
  let taskCallback = (error, prev) => {
    if (error) {
      errorCallback(error);
      return;
    }
    if (++currTask === tasks.length) {
      callback(prev);
    } else {
      tasks[currTask](prev, taskCallback);
    }
  }
  tasks[currTask](undefined, taskCallback);
};

module.exports = waterfall;