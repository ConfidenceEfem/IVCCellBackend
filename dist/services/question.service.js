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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuestion = exports.getAllQuestions = exports.findAllQuestionForOneCell = exports.getOneQuestion = exports.AskQuestion = void 0;
const AsyncHandler_1 = require("../utils/AsyncHandler");
const cell_model_1 = require("../model/cell.model");
const question_model_1 = require("../model/question.model");
const AppError_1 = require("../utils/AppError");
const admin_model_1 = require("../model/admin.model");
// cells being able to ask questions for difficulties
exports.AskQuestion = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { text } = req.body;
        const findCell = yield cell_model_1.CellModel.findById((_a = req === null || req === void 0 ? void 0 : req.cell) === null || _a === void 0 ? void 0 : _a._id);
        const findAdmin = yield admin_model_1.AdminModel.findById(findCell === null || findCell === void 0 ? void 0 : findCell.cellAdminId);
        const createQuestion = new question_model_1.QuestionModel({
            text: text
        });
        createQuestion.cellId = findCell;
        createQuestion.cellAdminId = findAdmin;
        createQuestion.save();
        return res.status(AppError_1.HttpCode.SUCCESSFUL).json({ message: "Question asked", data: createQuestion });
    }
    catch (error) {
        res === null || res === void 0 ? void 0 : res.status(AppError_1.HttpCode.UNPROCESSIBLE_IDENTITY).send(error);
    }
}));
// getting all questions asked by a particular cell
exports.getOneQuestion = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const questionId = req.params.id;
    const findQuestion = yield question_model_1.QuestionModel.findById(questionId).populate("replies").populate("cellId");
    return res.status(AppError_1.HttpCode.OK).json({ message: "Question", data: findQuestion });
}));
// get question asked by a user
exports.findAllQuestionForOneCell = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const id = (_b = req === null || req === void 0 ? void 0 : req.cell) === null || _b === void 0 ? void 0 : _b._id;
        const allMyQuestion = yield question_model_1.QuestionModel.find({ cellId: id }).populate("cellId").populate("cellAdminId");
        res === null || res === void 0 ? void 0 : res.status(AppError_1.HttpCode.OK).json({ message: "My Questions", data: allMyQuestion });
    }
    catch (err) {
        res === null || res === void 0 ? void 0 : res.status(AppError_1.HttpCode.UNPROCESSIBLE_IDENTITY).json({ message: err });
    }
}));
// get question asked by a user
exports.getAllQuestions = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        if (!((_c = req === null || req === void 0 ? void 0 : req.admin) === null || _c === void 0 ? void 0 : _c.isAdmin)) {
            next(new AppError_1.AppError({ message: "You don't have right ot perform this operation", httpCode: AppError_1.HttpCode.BAD_REQUEST }));
        }
        const allMyQuestion = yield question_model_1.QuestionModel.find().populate("cellId").populate("cellAdminId").sort({ _id: -1 });
        res === null || res === void 0 ? void 0 : res.status(AppError_1.HttpCode.OK).json({ message: "All Questions", data: allMyQuestion });
    }
    catch (err) {
        res === null || res === void 0 ? void 0 : res.status(AppError_1.HttpCode.UNPROCESSIBLE_IDENTITY).json({ message: err });
    }
}));
// delete one question
exports.deleteQuestion = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findQuestion = yield question_model_1.QuestionModel.findByIdAndDelete(req.params.id);
        return res.status(AppError_1.HttpCode.OK).json({ message: "Question deleted successfully", data: findQuestion });
    }
    catch (error) {
        res.status(AppError_1.HttpCode.UNPROCESSIBLE_IDENTITY).json({ message: error });
    }
}));
