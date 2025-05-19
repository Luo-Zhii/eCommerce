import { Response } from 'express';
import reasonPhrases from '../constants/reasonPhrases';
import statusCode from '../constants/statusCodes';

class SuccessResponse {
    message: string;
    status: number;
    metadata: any;

    constructor({ message, status = statusCode.OK, reasonStatusCode = reasonPhrases.OK, metadata = {} }: 
        { message?: string; status?: number; reasonStatusCode?: string; metadata?: any }) {
        this.message = !message ? reasonStatusCode : message;
        this.status = status;
        this.metadata = metadata    
    }
    send(res: Response, headers = {}) {
        return res.status(this.status).json({
            headers : {
                ...this
            }
        })
    }
}

class OK extends SuccessResponse {
    constructor(message: string = reasonPhrases.OK, metadata: any = {}) {
        super({ message, status: statusCode.OK , metadata });
    }
}
class CREATED extends SuccessResponse {
    option: any;
    constructor(message: string = reasonPhrases.CREATED, metadata: any = {}, options?: any) {
        super({ message, status: statusCode.CREATED, metadata });
        this.option = options
    }
}

export { OK, CREATED };