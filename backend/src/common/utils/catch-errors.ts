import {AppError} from "./AppError";
import {ErrorCode} from "../enums/error_code.enum";
import {HTTP_STATUS, HttpStatusCodeType} from "../../config/http.config";

export class NotFoundException extends AppError {

    constructor(
        message: string = "Resource Not Found",
        errorCode?: ErrorCode) {
        super(message, HTTP_STATUS.NOT_FOUND, errorCode || ErrorCode.RESOURCE_NOT_FOUND);
    }
}

export class UnauthorizedException extends AppError {
    constructor(
        message = "Unauthorized Access",
        errorCode?: ErrorCode.ACCESS_UNAUTHORIZED,
    ) {
        super(message, HTTP_STATUS.UNAUTHORIZED, errorCode || ErrorCode.ACCESS_UNAUTHORIZED);
    }
}

export class BadRequestException extends AppError {
    constructor(
        message = "Bad Request",
        errorCode: ErrorCode
    ) {
        super(message, HTTP_STATUS.BAD_REQUEST, errorCode);
    }
}

export class InternalServerError extends AppError {
    constructor(
        message = "Internal Server Error",
        errorCode?: ErrorCode.INTERNAL_SERVER_ERROR,
    ) {
        super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, errorCode);
    }
}