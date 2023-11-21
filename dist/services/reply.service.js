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
exports.ReplyQuestion = void 0;
const AsyncHandler_1 = require("../utils/AsyncHandler");
const question_model_1 = require("../model/question.model");
const AppError_1 = require("../utils/AppError");
const reply_model_1 = require("../model/reply.model");
const mongoose_1 = __importDefault(require("mongoose"));
const admin_model_1 = require("../model/admin.model");
// reply question end point meant only for admin
exports.ReplyQuestion = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const findAmdin = yield admin_model_1.AdminModel.findById((_a = req === null || req === void 0 ? void 0 : req.admin) === null || _a === void 0 ? void 0 : _a._id);
        if (!findAmdin)
            next(new AppError_1.AppError({ message: "You don't have right to perform this operation", httpCode: AppError_1.HttpCode.BAD_REQUEST }));
        const getQuestion = yield question_model_1.QuestionModel.findById(req.params.id);
        const replyQuestion = new reply_model_1.ReplyModel({
            replyText: req.body.replyText
        });
        replyQuestion.questionId = getQuestion;
        replyQuestion.userId = findAmdin;
        replyQuestion.save();
        getQuestion === null || getQuestion === void 0 ? void 0 : getQuestion.replies.push(new mongoose_1.default.Types.ObjectId(replyQuestion._id));
        getQuestion === null || getQuestion === void 0 ? void 0 : getQuestion.save();
        res === null || res === void 0 ? void 0 : res.status(AppError_1.HttpCode.SUCCESSFUL).json({ message: "replid done", data: replyQuestion });
    }
    catch (error) {
        res.status(AppError_1.HttpCode.UNPROCESSIBLE_IDENTITY).json({ message: error });
    }
}));
