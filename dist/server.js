"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const express_1 = __importDefault(require("express"));
const error_1 = require("./middlewares/error");
const api_1 = __importDefault(require("./api"));
const cors_1 = __importDefault(require("cors"));
const appConfig = (app) => {
    app
        .use(express_1.default.json())
        .use((0, cors_1.default)())
        .get("/", (req, res, next) => {
        res.send("Welcome to my page");
    })
        .use("/api", api_1.default)
        .all("*", (req, res) => {
        res.status(404).json({ message: "This route is not found", data: req.originalUrl });
    })
        .use(error_1.ErrorHandler);
};
exports.appConfig = appConfig;
