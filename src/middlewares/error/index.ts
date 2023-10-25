import { AppError, HttpCode } from "../../utils/AppError"
import {  NextFunction, Request, Response } from "express"


const devErrorHandler = (err: AppError, res: Response) => {
    return res.status(HttpCode.UNPROCESSIBLE_IDENTITY).json({
        err: err,
        stack: err.stack,
        name: err.name,
        message: err.message
    })
}

export const ErrorHandler = (err: AppError,req: Request,res: Response, next: NextFunction) => {
     devErrorHandler(err,res)
}



