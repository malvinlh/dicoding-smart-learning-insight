const ClientError = require('../exceptions/ClientError');

const errorHandler = (server) => {
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (!response.isBoom) {
      return h.continue;
    }

    const error = response;

    if (error instanceof ClientError) {
      return h
        .response({
          status: 'fail',
          message: error.message,
        })
        .code(error.statusCode);
    }

    if (error.output.statusCode >= 400 && error.output.statusCode < 500) {
      return h
        .response({
          status: 'fail',
          message: error.message,
        })
        .code(error.output.statusCode);
    }

    return h
      .response({
        status: 'error',
        message: 'Maaf, terjadi kesalahan pada server kami.',
      })
      .code(500);
  });
};

module.exports = errorHandler;
