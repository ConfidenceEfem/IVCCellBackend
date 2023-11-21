"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpModel = void 0;
const mongoose_1 = require("mongoose");
const otpSchema = new mongoose_1.Schema({
    otp: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    verificationKey: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now(), index: { expires: 30000 } }
}, {
    timestamps: true
});
exports.OtpModel = (0, mongoose_1.model)("otp", otpSchema);
