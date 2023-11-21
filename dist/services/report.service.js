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
exports.GetOneSignleReport = exports.AllAdminReports = exports.AllCellReportById = exports.AllCellReports = exports.AllReports = exports.MakeReport = void 0;
const report_model_1 = require("../model/report.model");
const AsyncHandler_1 = require("../utils/AsyncHandler");
const AppError_1 = require("../utils/AppError");
const mongoose_1 = __importDefault(require("mongoose"));
const admin_model_1 = require("../model/admin.model");
const cell_model_1 = require("../model/cell.model");
// get all reports
exports.MakeReport = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { review, attendanceDetails, totalAttendance, topicDiscussed, date, newMembers, numberOfPeopleWhoacceptedSalvation, } = req.body;
    const findCell = yield cell_model_1.CellModel.findById((_a = req === null || req === void 0 ? void 0 : req.cell) === null || _a === void 0 ? void 0 : _a._id);
    const findAdmin = yield admin_model_1.AdminModel.findById((_b = req === null || req === void 0 ? void 0 : req.cell) === null || _b === void 0 ? void 0 : _b.cellAdminId);
    console.log(findAdmin);
    const createReport = new report_model_1.ReportModel({
        review,
        attendanceDetails,
        totalAttendance,
        topicDiscussed,
        date,
        newMembers,
        numberOfPeopleWhoacceptedSalvation,
    });
    createReport.cellAdminId = findAdmin;
    createReport.cellId = findCell;
    createReport.save();
    (_c = findCell === null || findCell === void 0 ? void 0 : findCell.cellReport) === null || _c === void 0 ? void 0 : _c.push(new mongoose_1.default.Types.ObjectId(createReport === null || createReport === void 0 ? void 0 : createReport._id));
    yield (findCell === null || findCell === void 0 ? void 0 : findCell.save());
    res
        .status(AppError_1.HttpCode.SUCCESSFUL)
        .json({ message: "Report created successfully", data: createReport });
}));
// get all reports
exports.AllReports = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const allReports = yield report_model_1.ReportModel.find().sort({ _id: -1 }).populate("cellId");
    if (!((_d = req === null || req === void 0 ? void 0 : req.admin) === null || _d === void 0 ? void 0 : _d.isSuperAdmin))
        next(new AppError_1.AppError({
            message: "You don't have right for this operation",
            httpCode: AppError_1.HttpCode.BAD_REQUEST,
        }));
    res
        .status(AppError_1.HttpCode.SUCCESSFUL)
        .json({ message: "Report successfully gotten", data: allReports });
}));
// get only logged in user cell report
exports.AllCellReports = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const userId = (_e = req === null || req === void 0 ? void 0 : req.cell) === null || _e === void 0 ? void 0 : _e._id;
    const allReports = yield report_model_1.ReportModel.find({ cellId: userId }).sort({
        _id: -1,
    });
    res
        .status(AppError_1.HttpCode.SUCCESSFUL)
        .json({ message: "All report gotten successfully", data: allReports });
}));
// get cell report by id
exports.AllCellReportById = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cellId = req.params.id;
    const allReports = yield report_model_1.ReportModel.find({ cellId: cellId }).sort({
        _id: -1,
    }).populate("cellId");
    res
        .status(AppError_1.HttpCode.SUCCESSFUL)
        .json({ message: "All report gotten successfully", data: allReports });
}));
// Get report for one admin
exports.AllAdminReports = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    const userId = (_f = req === null || req === void 0 ? void 0 : req.admin) === null || _f === void 0 ? void 0 : _f._id;
    const allReports = yield report_model_1.ReportModel.find({ cellAdminId: userId });
    res
        .status(AppError_1.HttpCode.SUCCESSFUL)
        .json({ message: "All Reports", data: allReports });
}));
// Get one report
exports.GetOneSignleReport = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const reportId = req.params.id;
    const OneReport = yield report_model_1.ReportModel.findById(reportId);
    res
        .status(AppError_1.HttpCode.SUCCESSFUL)
        .json({ message: "One Reports", data: OneReport });
}));
