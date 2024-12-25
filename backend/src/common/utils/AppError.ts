import {HTTP_STATUS} from "../../config/http.config";
import {ErrorCode} from "../enums/error_code.enum";

export class AppError extends Error {
    private statusCode: number
    private errorCode?: string

    constructor(
        message: string,
        statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
        errorCode: ErrorCode | undefined
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        Error.captureStackTrace(this, this.constructor);
    }

    public get status_code(){
        return this.statusCode;
    }

    public get error_code() {
        return this.errorCode
    }
}