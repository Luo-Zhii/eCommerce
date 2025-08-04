import reasonPhrases from "../constants/reasonPhrases";
import statusCode from "../constants/statusCodes";
import myloggerLog from "../logger/mylogger.log";
import logger from "../logger/winston/winston.log";
class ErrorResponse extends Error {
  public status: number;
  public now: any;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.now = new Date().toLocaleString();

    // logger.error(`${this.status}-${this.message}`);

    // myloggerLog.error({
    //   message: this.message,
    //   params: [
    //     { context: "/api/v1/login" },
    //     // { requestId: "AAABBBB" },
    //     { error: "Bad request error " },
    //   ],
    // });
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message: string = reasonPhrases.CONFLICT,
    status: number = statusCode.CONFLICT
  ) {
    super(message, status);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message: string = reasonPhrases.BAD_REQUEST,
    status: number = statusCode.BAD_REQUEST
  ) {
    super(message, status);
  }
}

class UnauthorizedError extends ErrorResponse {
  constructor(
    message: string = reasonPhrases.UNAUTHORIZED,
    status: number = statusCode.UNAUTHORIZED
  ) {
    super(message, status);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(
    message: string = reasonPhrases.NOT_FOUND,
    status: number = statusCode.NOT_FOUND
  ) {
    super(message, status);
  }
}
class ForbiddenError extends ErrorResponse {
  constructor(
    message: string = reasonPhrases.FORBIDDEN,
    status: number = statusCode.FORBIDDEN
  ) {
    super(message, status);
  }
}
export {
  ConflictRequestError,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ForbiddenError,
};
