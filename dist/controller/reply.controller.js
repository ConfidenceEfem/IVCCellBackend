"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplyQuestionEndPoint = void 0;
const reply_service_1 = require("../services/reply.service");
const ReplyQuestionEndPoint = (req, res, next) => (0, reply_service_1.ReplyQuestion)(req, res, next);
exports.ReplyQuestionEndPoint = ReplyQuestionEndPoint;
