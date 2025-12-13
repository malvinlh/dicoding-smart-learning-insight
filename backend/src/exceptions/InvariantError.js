const ClientError = require('./ClientError');

class InvariantError extends ClientError {
  constructor(message = 'Tidak dapat memproses permintaan') {
    super(message, 400);
    this.name = 'InvariantError';
  }
}

module.exports = InvariantError;
