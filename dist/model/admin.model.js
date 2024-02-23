"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModel = void 0;
const mongoose_1 = require("mongoose");
const adminSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    isFirstTimeLogin: { type: Boolean, default: true },
    adminEmail: { type: String, required: true },
    adminPassword: { type: String },
    image: { type: String, default: "" },
    adminFullName: { type: String, default: "" },
    bio: { type: String, default: "" },
    maritalStatus: { type: String, default: "" },
    leaderShipPosition: { type: String, default: "" },
    isEmailVerified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: true },
    isSuperAdmin: { type: Boolean, default: false },
    cells: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "cell"
        }
    ]
}, {
    timestamps: true
});
exports.AdminModel = (0, mongoose_1.model)("admin", adminSchema);
