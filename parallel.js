const parallel = (tasks, callback, errorCallback) => {
  let tasksCompleted = 0;
  let errors = [];
  tasks.forEach((currTask, index, array) => {
    
    currTask((error) => {
      if (error) errors.push(error); 
      tasksCompleted++;
      if (tasksCompleted === tasks.length) {
        if (errors.length > 0) errorCallback(errors);
        callback();
      }
    });

  });
};

module.exports = parallel;
