export abstract class AError extends Error {
  statusCode: number = 500
  constructor(statusCode: number, message = 'Internal Server Error') {
    super(message)
    this.statusCode = statusCode
  }
}

export abstract class BadRequestError extends AError {
  constructor(message = 'Bad Request') {
    super(400, message)
  }
}

export class NotFoundError extends AError {
  constructor(message = 'Not Found') {
    super(404, message)
  }
}

export class ValidateError extends AError {
  constructor(message = 'Validate Error') {
    super(422, message)
  }
}

export class ConflictError extends AError {
  constructor(message = 'Conflict Error') {
    super(409, message)
  }
}
