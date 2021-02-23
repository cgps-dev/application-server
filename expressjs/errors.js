function ValidationError(message) {
  this.name = 'ValidationError';
  this.message = message || 'Validation Error';
  this.stack = (new Error()).stack;
}
ValidationError.prototype = Object.create(Error.prototype);
ValidationError.prototype.constructor = ValidationError;

function StatusCodeError(message) {
  this.name = 'StatusCodeError';
  this.message = message || 'StatusCode Error';
  this.stack = (new Error()).stack;
}
StatusCodeError.prototype = Object.create(Error.prototype);
StatusCodeError.prototype.constructor = StatusCodeError;

const isErrorCode = /^[0-9]{3}$/;

function catchErrorResponse(res, error) {
  if (error instanceof ValidationError) {
    return res.status(400).send([ error.message ]);
  }

  if (error instanceof StatusCodeError) {
    return res.sendStatus(error.message);
  }

  if (error instanceof Error) {
    if (isErrorCode.test(error.message)) {
      return res.sendStatus(error.message);
    }
    const errorMessge = `Something went wrong, please try again later (${(+ new Date())}).`;
    console.error(errorMessge);
    console.error(error);
    return res.status(500).send([ errorMessge ]);
  }

  if (Array.isArray(error)) {
    return res.status(400).send(error);
  }

  return res.status(400).send([ error ]);
}

module.exports = {
  catchErrorResponse,
  ValidationError,
  StatusCodeError,
};
