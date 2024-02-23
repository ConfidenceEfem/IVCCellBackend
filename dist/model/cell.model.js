"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CellModel = void 0;
const mongoose_1 = require("mongoose");
const cellSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    isFirstTimeLogin: { type: Boolean, default: true },
    cellEmail: { type: String, required: true },
    image: {
        type: String,
        default: ""
    },
    maritalStatus: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    cellAdminId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "admin",
    },
    cellPassword: { type: String },
    cellLeaderName: { type: String, default: "" },
    isEmailVerified: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
    cellReport: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "reports",
        },
    ],
    cellQuestions: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "question",
        },
    ],
}, {
    timestamps: true,
});
exports.CellModel = (0, mongoose_1.model)("cell", cellSchema);
