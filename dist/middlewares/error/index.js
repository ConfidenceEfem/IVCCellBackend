"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
const AppError_1 = require("../../utils/AppError");
const devErrorHandler = (err, res) => {
    return res.status(AppError_1.HttpCode.UNPROCESSIBLE_IDENTITY).json({
        err: err,
        stack: err.stack,
        name: err.name,
        message: err.message
    });
};
const ErrorHandler = (err, req, res, next) => {
    devErrorHandler(err, res);
};
exports.ErrorHandler = ErrorHandler;
