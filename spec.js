const expect = require('chai').expect;
const asyncMap = require('./asyncMap');
const asyncReduce = require('./asyncreduce');
const asyncFilter = require('./asyncfilter');
const parallel = require('./parallel');
const series = require('./series');
const waterfall = require('./waterfall');

describe('async javascript functions', () => {
    const func1 = (cb) => {
      setTimeout(() => cb(1), 40);
    };
    const func2 = (cb) => {
      setTimeout(() => cb(2), 50);
    };
    const func3 = (cb) => {
      setTimeout(() => cb(3), 10);
    };
    const funcArray = [func1, func2, func3];

  it('asyncMap should return array of values in correct order', (done) => {
    asyncMap(funcArray, (output) => {
      expect(output).to.deep.equal([1, 2, 3]);
      done();
    });
  });

  it('asyncReduce should reduce values in the correct order', (done) => {
    asyncReduce(funcArray, (prev, curr, index) => {
      if (index % 2 === 0) return prev + curr;
      return prev - curr;
    }, 0, (output) => {
      expect(output).to.equal(2);
      done();
    });
  });

  it('asyncFilter should filter out values correctly and in order', (done) => {
    asyncFilter(funcArray, (value) => value % 2 === 1, (output) => {
      expect(output).to.deep.equal([1, 3]);
      done();
    });
  });

  it('parallel should only execute callback after all tasks have been completed', (done) => {
    const user = {};
    const getUserName = (cb) => {
      setTimeout(() => {
        user.name = 'Rahim'
        cb();
      }, 50);
    }
    const getUserLocation = (cb) => {
      setTimeout(() => {
        user.loc = 'CA'
        cb();
      }, 75);
    }
    const tasksArr = [getUserName, getUserLocation];
    parallel(tasksArr, () => {
      expect(user).to.deep.equal({ name: 'Rahim', loc: 'CA' });
      done();
    });
  });

  it('parallel should handle errors', (done) => {
    let callbacksCompleted = 0;
    const user = {};
    const getUserName = (cb) => {
      setTimeout(() => {
        user.name = 'Rahim'
        cb();
      }, 50);
    };
    const getUserLocation = (cb) => {
      setTimeout(() => {
        user.loc = 'CA'
        cb();
      }, 75);
    };
    const getUserPassword = (cb) => {
      setTimeout(() => {
        cb('Access Denied');
      }, 30);
    };
    const tasksArr = [getUserName, getUserLocation, getUserPassword];
    parallel(tasksArr, () => {
      expect(user).to.deep.equal({ name: 'Rahim', loc: 'CA' });
      if (++callbacksCompleted === 2) done();
    }, (errors) => {
      expect(errors).to.deep.equal(['Access Denied']);
      if (++callbacksCompleted === 2) done();
    });
  });

  it('series should execute tasks in order', (done) => {
    const output = [];
    const task1 = (cb) => {
      setTimeout(() => {
        output.push(1);
        cb();
      }, 10);
    };
    const task2 = (cb) => {
      setTimeout(() => {
        output.push(2);
        cb();
      }, 50);
    };
    const task3 = (cb) => {
      setTimeout(() => {
        output.push(3);
        cb();
      }, 0);
    };
    const tasks = [task1, task2, task3];

    series(tasks, () => {
      expect(output).to.deep.equal([1, 2, 3]);
      done();
    });
  });

  it('series should handle errors', (done) => {
    let callbacksCompleted = 0;
    const output = [];
    const task1 = (cb) => {
      setTimeout(() => {
        output.push(1);
        cb();
      }, 100);
    };
    const task2 = (cb) => {
      setTimeout(() => {
        output.push(2);
        cb('ERROR 2');
      }, 50);
    };
    const tasks = [task1, task2];

    series(tasks, () => {
      expect(output).to.deep.equal([1, 2]);
      if (++callbacksCompleted === 2) done();
    }, (errors) => {
      expect(errors).to.deep.equal(['ERROR 2']);
      if (++callbacksCompleted === 2) done();
    });
  });

  it('waterfall should execute tasks in order and pass previous task\'s output to next task', (done) => {
    const task1 = (prev, cb) => {
      setTimeout(() => {
        cb(null, 12);
      }, 100);
    };
    const task2 = (prev, cb) => {
      setTimeout(() => {
        cb(null, prev * 10);
      }, 50);
    };
    const tasks = [task1, task2];
    waterfall(tasks, (output) => {
      expect(output).to.equal(120);
      done();
    });
  });

  it('waterfall should short-circuit if there are errors', (done) => {
    const task1 = (prev, cb) => {
      setTimeout(() => {
        cb(null, 12);
      }, 100);
    };
    const task2 = (prev, cb) => {
      if (prev === 12) cb('FOOBAR!');
    }
    const task3 = (prev, cb) => {
      setTimeout(() => {
        cb(null, prev * 10);
      }, 50);
    };
    const tasks = [task1, task2, task3];
    waterfall(tasks, () => {}, (error) => {
      expect(error).to.equal('FOOBAR!');
      done();
    });
  });

});





