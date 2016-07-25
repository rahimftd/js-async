const series = (tasks, callback, errorCallback) => {
  let currTask = 0;
  const errors = [];
  let taskCallback = (error) => {
    if(error) errors.push(error);

    if (++currTask === tasks.length) {
      if (errors.length > 0) errorCallback(errors);
      callback();
    } else {
      tasks[currTask](taskCallback);
    }
  }
  tasks[currTask](taskCallback);
};

module.exports = series;