import {ErrorRequestHandler, NextFunction, Request, Response} from "express";
import { HTTP_STATUS} from "../config/http.config";
import {AppError} from "../common/utils/AppError";

export const errorHandler: ErrorRequestHandler = (error: any, req: Request, res: Response, next: NextFunction): any => {
    if(error instanceof SyntaxError) return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Invalid JSON format, please check your request body"
    })

    if(error instanceof AppError) {
        return res.status(error.status_code).json({
            message: error.message,
            errorCode: error.error_code
        })
    }

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
        error: error?.message || "Unknown Error"
    })
}