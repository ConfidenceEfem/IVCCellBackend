"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAdminUser = exports.checkCellUser = void 0;
const AsyncHandler_1 = require("./AsyncHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("./AppError");
const EnvironmentalVariables_1 = require("../config/EnvironmentalVariables");
exports.checkCellUser = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const getToken = req.headers.authorization;
    if (!getToken) {
        res.status(AppError_1.HttpCode.BAD_REQUEST).send("No token");
    }
    else {
        const getJwtToken = getToken === null || getToken === void 0 ? void 0 : getToken.split(" ")[1];
        if (!getJwtToken) {
            res.status(AppError_1.HttpCode.BAD_REQUEST).send("Check token");
        }
        else {
            jsonwebtoken_1.default.verify(getJwtToken, EnvironmentalVariables_1.environmentalVariables.JWT_SECRET_KEY, (err, payload) => {
                if (err) {
                    res.status(403).json({ message: err.message, err: err });
                    return;
                }
                req.cell = payload;
                next();
            });
        }
    }
}));
exports.checkAdminUser = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const getToken = req.headers.authorization;
    if (!getToken) {
        res.status(AppError_1.HttpCode.BAD_REQUEST).send("No token");
    }
    else {
        const getJwtToken = getToken === null || getToken === void 0 ? void 0 : getToken.split(" ")[1];
        if (!getJwtToken) {
            res.status(AppError_1.HttpCode.BAD_REQUEST).send("Check token");
        }
        else {
            jsonwebtoken_1.default.verify(getJwtToken, EnvironmentalVariables_1.environmentalVariables.JWT_SECRET_KEY, (err, payload) => {
                if (err) {
                    res.status(403).json({ message: err.message, err: err });
                    return;
                }
                req.admin = payload;
                next();
            });
        }
    }
}));
