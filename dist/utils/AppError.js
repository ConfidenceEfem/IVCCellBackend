"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = exports.HttpCode = void 0;
var HttpCode;
(function (HttpCode) {
    HttpCode[HttpCode["OK"] = 200] = "OK";
    HttpCode[HttpCode["SUCCESSFUL"] = 201] = "SUCCESSFUL";
    HttpCode[HttpCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpCode[HttpCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpCode[HttpCode["UNPROCESSIBLE_IDENTITY"] = 422] = "UNPROCESSIBLE_IDENTITY";
})(HttpCode = exports.HttpCode || (exports.HttpCode = {}));
class AppError extends Error {
    constructor(args) {
        super(args.message);
        this.isOperational = true;
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = args.name || "ERROR";
        this.httpCode = args.httpCode;
        if (args.isOperational !== undefined) {
            this.isOperational = args.isOperational;
        }
        Error.captureStackTrace(this);
    }
}
exports.AppError = AppError;
