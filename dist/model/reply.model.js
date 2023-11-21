"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplyModel = void 0;
const mongoose_1 = require("mongoose");
const RepliesSchema = new mongoose_1.Schema({
    replyText: { type: String, required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "admin" },
    questionId: { type: mongoose_1.Schema.Types.ObjectId, ref: "question" },
}, {
    timestamps: true
});
exports.ReplyModel = (0, mongoose_1.model)("reply", RepliesSchema);
