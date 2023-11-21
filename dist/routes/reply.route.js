"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkUser_1 = require("../utils/checkUser");
const reply_controller_1 = require("../controller/reply.controller");
const express_1 = require("express");
const ReplyRouter = (0, express_1.Router)();
ReplyRouter.post("/question/:id", checkUser_1.checkAdminUser, reply_controller_1.ReplyQuestionEndPoint);
exports.default = ReplyRouter;
