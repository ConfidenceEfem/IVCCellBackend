"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportModel = void 0;
const mongoose_1 = require("mongoose");
const reportSchema = new mongoose_1.Schema({
    date: { type: Date, required: true },
    totalAttendance: { type: Number, required: true },
    newMembers: { type: Number, required: true },
    numberOfPeopleWhoacceptedSalvation: { type: Number, required: true },
    review: { type: String, required: true },
    topicDiscussed: { type: String, required: true },
    attendanceDetails: { type: Array, required: true },
    cellAdminId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "admin"
    },
    cellId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "cell"
    }
}, {
    timestamps: true
});
exports.ReportModel = (0, mongoose_1.model)("reports", reportSchema);
