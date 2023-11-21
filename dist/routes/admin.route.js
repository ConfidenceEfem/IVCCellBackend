"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkUser_1 = require("../utils/checkUser");
// import { weeklyReport } from "../controller/report.controller"
const admin_controller_1 = require("../controller/admin.controller");
const user_controller_1 = require("../controller/user.controller");
const adminRouter = (0, express_1.Router)();
// adminRouter.get("/report",checkAdminUser, weeklyReport)
adminRouter.get("/admins", checkUser_1.checkAdminUser, admin_controller_1.AllAdmins);
adminRouter.get("/me", checkUser_1.checkAdminUser, admin_controller_1.currentAdmin);
adminRouter.get("/cells/:id", checkUser_1.checkAdminUser, admin_controller_1.cellsUnderOneChurch);
adminRouter.post("/cell/suspend/:id", checkUser_1.checkAdminUser, user_controller_1.suspendACellEndpoint);
adminRouter.post("/cell/suspend/:id", checkUser_1.checkAdminUser, user_controller_1.unSuspendACellEndpoint);
exports.default = adminRouter;
