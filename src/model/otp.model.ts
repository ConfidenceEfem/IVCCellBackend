import { IOtp } from "../interface/otp.interface";
import { Schema, model } from "mongoose";

const otpSchema = new Schema<IOtp>({
    otp: {type: String, required: true, trim: true},
    email: {type: String, trim: true},
    verificationKey: {type: String,required: true, trim: true},
    createdAt: {type: Date, default: Date.now(), index: {expires: 30000}}
}, {
    timestamps: true
})

export const OtpModel = model("otp", otpSchema)