"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connnectMongodb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const EnvironmentalVariables_1 = require("./EnvironmentalVariables");
const connnectMongodb = () => {
    const url = EnvironmentalVariables_1.environmentalVariables.MONGOOSE_URL;
    const connectDb = mongoose_1.default.connect(url).then((db) => {
        console.log("Connected to db", db.connection.host);
    }).catch((err) => {
        console.log("mongodb error", err);
    });
    return connectDb;
};
exports.connnectMongodb = connnectMongodb;
