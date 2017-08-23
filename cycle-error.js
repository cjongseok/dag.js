const ExtendableError = require('es6-error');

class CycleError extends ExtendableError {
  constructor(message = 'DAG has cycle(s)') {
    super(message);
  }
}

module.exports = CycleError;
