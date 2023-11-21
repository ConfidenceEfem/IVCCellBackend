"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const report_route_1 = __importDefault(require("../routes/report.route"));
const admin_route_1 = __importDefault(require("../routes/admin.route"));
const user_route_1 = __importDefault(require("../routes/user.route"));
const express_1 = require("express");
const question_route_1 = __importDefault(require("../routes/question.route"));
const reply_route_1 = __importDefault(require("../routes/reply.route"));
const router = (0, express_1.Router)();
router.use("/auth", user_route_1.default);
router.use("/cell", report_route_1.default);
router.use("/admin", admin_route_1.default);
router.use("/question", question_route_1.default);
router.use("/reply", reply_route_1.default);
exports.default = router;
