"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("../controller/user.controller");
const express_1 = require("express");
const checkUser_1 = require("../utils/checkUser");
const multer_1 = __importDefault(require("../config/multer"));
const user_services_1 = require("../services/user.services");
const userRouter = (0, express_1.Router)();
userRouter.post("/register-cell", checkUser_1.checkAdminUser, user_controller_1.newCellRegistration);
userRouter.post("/register-admin", checkUser_1.checkAdminUser, user_controller_1.newAdminRegistration);
userRouter.post("/login-cell", user_controller_1.signInACell);
userRouter.post("/login-admin", user_controller_1.signInAnAdmin);
userRouter.post("/verify-cellemail", user_controller_1.verifyCellEmail);
userRouter.post("/verify-adminemail", user_controller_1.verifyAdminEmail);
userRouter.post("/resend-otp", user_controller_1.resendOtpForEmailVerification);
userRouter.post("/reset-cellpassword", checkUser_1.checkCellUser, user_controller_1.resetCellPassword);
userRouter.post("/cell/update", checkUser_1.checkCellUser, multer_1.default, user_controller_1.updateDataForCell);
userRouter.post("/admin/update", checkUser_1.checkAdminUser, multer_1.default, user_services_1.updateAdminData);
userRouter.post("/reset-adminpassword", checkUser_1.checkAdminUser, user_controller_1.resetAdminPassword);
// userRouter.post("/weekly-reports",checkCellUser, WeeklyReport)
userRouter.get("/church/cells", checkUser_1.checkAdminUser, user_controller_1.AllCellsForOneChurch);
userRouter.get("/cells", checkUser_1.checkAdminUser, user_controller_1.AllCells);
userRouter.get("/me", checkUser_1.checkCellUser, user_controller_1.CellUserProfile);
userRouter.get("/admin/:id", user_controller_1.GetAdminById);
userRouter.get("/cell/:id", user_controller_1.GetCellById);
exports.default = userRouter;
