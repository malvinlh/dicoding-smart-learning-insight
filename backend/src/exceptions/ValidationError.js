const ClientError = require('./ClientError');

class ValidationError extends ClientError {
  constructor(message = 'Payload tidak valid') {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

module.exports = ValidationError;
