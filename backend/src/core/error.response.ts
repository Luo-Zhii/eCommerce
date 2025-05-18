import reasonPhrases from '../constants/reasonPhrases';
import statusCode from '../constants/statusCodes';

class ErrorResponse extends Error {
    public status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message: string = reasonPhrases.CONFLICT, status: number = statusCode.CONFLICT) {
        super(message, status);
    }
}

class BadRequestError extends ErrorResponse {
    constructor( message: string = reasonPhrases.BAD_REQUEST, status: number = statusCode.BAD_REQUEST) {
        super(message, status);
    }
}
export { ConflictRequestError, BadRequestError }; 