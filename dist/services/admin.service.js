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
exports.getAllCellsForUnderOneChurch = exports.currentAdminUser = exports.getAllAdmin = void 0;
const AppError_1 = require("../utils/AppError");
const AsyncHandler_1 = require("../utils/AsyncHandler");
const admin_model_1 = require("../model/admin.model");
exports.getAllAdmin = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!((_a = req === null || req === void 0 ? void 0 : req.admin) === null || _a === void 0 ? void 0 : _a.isSuperAdmin))
        next(new AppError_1.AppError({ message: "You don't have right for this operation", httpCode: AppError_1.HttpCode.BAD_REQUEST }));
    const allCells = yield admin_model_1.AdminModel.find();
    res.status(AppError_1.HttpCode.OK).json({ message: "All Church", data: allCells });
}));
// get current cell user
exports.currentAdminUser = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const userId = (_b = req === null || req === void 0 ? void 0 : req.admin) === null || _b === void 0 ? void 0 : _b._id;
        const currentAdmin = yield admin_model_1.AdminModel.findById(userId);
        res.status(AppError_1.HttpCode.OK).json({ message: "Me", data: currentAdmin });
    }
    catch (error) {
        res === null || res === void 0 ? void 0 : res.status(AppError_1.HttpCode.UNPROCESSIBLE_IDENTITY).json({ message: error });
    }
}));
// get current cell user
exports.getAllCellsForUnderOneChurch = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const allAdminCells = yield admin_model_1.AdminModel.findById(userId).populate("cells");
        res.status(AppError_1.HttpCode.OK).json({ message: "My Cells", data: allAdminCells });
    }
    catch (error) {
        res === null || res === void 0 ? void 0 : res.status(AppError_1.HttpCode.UNPROCESSIBLE_IDENTITY).json({ message: error });
    }
}));
