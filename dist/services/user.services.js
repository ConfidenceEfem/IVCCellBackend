"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unSuspendACell = exports.suspendACell = exports.oneAdminUser = exports.oneCellUser = exports.currentCellUser = exports.getAllCellsForOneAdmin = exports.getAllCells = exports.updateAdminData = exports.updateCellData = exports.resetPasswordForAdmin = exports.resetPassword = exports.resendVerificationEmailOtpForAdmin = exports.verifyEmailForAdmin = exports.verifyEmailForCell = exports.loginACell = exports.loginAnAdmin = exports.registerANewCell = exports.registerAnAdmin = void 0;
const AsyncHandler_1 = require("../utils/AsyncHandler");
const bcrypt_1 = __importDefault(require("bcrypt"));
const cell_model_1 = require("../model/cell.model");
const AppError_1 = require("../utils/AppError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const EnvironmentalVariables_1 = require("../config/EnvironmentalVariables");
const otp_generator_1 = __importDefault(require("otp-generator"));
const sendMail_1 = require("../config/sendMail");
const otp_model_1 = require("../model/otp.model");
const admin_model_1 = require("../model/admin.model");
const mongoose_1 = __importDefault(require("mongoose"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const hashPasswordUsingBcrypt = (cellPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const genSalt = yield bcrypt_1.default.genSalt(10);
    const hashPassword = yield bcrypt_1.default.hash(cellPassword, genSalt);
    return hashPassword;
});
const generateJwt = (payload) => {
    const token = jsonwebtoken_1.default.sign(payload, EnvironmentalVariables_1.environmentalVariables.JWT_SECRET_KEY, {
        expiresIn: "1d",
    });
    return token;
};
// generate random password
const generateRandomPassword = () => {
    const randomPassword = otp_generator_1.default.generate(8, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        digits: true,
        specialChars: false
    });
    return randomPassword;
};
// send mail for email verification when you log in for first time
const sendTwoFactorAuthorizationByEmail = (otp, email, verificationKey) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcrypt_1.default.genSalt(10);
    const otpObject = new otp_model_1.OtpModel({
        verificationKey: verificationKey,
        otp: otp,
        email: email,
    });
    otpObject.verificationKey = yield bcrypt_1.default.hash(otpObject.verificationKey, salt);
    otpObject.otp = yield bcrypt_1.default.hash(otpObject.otp, salt);
    otpObject.save();
    console.log(otp);
    (0, sendMail_1.sendEmailToUsers)(email, "Complete Two Factor Authorization", `<h4>Copy and paste the otp : ${otp} to complete your 2FA. Otp expires in 5 minutess</h4>`);
});
// register an admin
exports.registerAnAdmin = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { adminEmail, isAdmin, isSuperAdmin, name, adminPassword } = req.body;
    const findIfAdminExist = yield admin_model_1.AdminModel.findOne({ adminEmail });
    if (findIfAdminExist) {
        next(new AppError_1.AppError({
            message: "This email is already registered to a church",
            httpCode: AppError_1.HttpCode.BAD_REQUEST,
        }));
    }
    else {
        const adminPasswordgenerated = generateRandomPassword();
        const hashPassword = yield hashPasswordUsingBcrypt(adminPasswordgenerated);
        // const hashPassword = await hashPasswordUsingBcrypt(adminPassword)
        // if (!req?.admin?.isSuperAdmin)
        //   next(
        //     new AppError({
        //       message: "You don't have right to perform this operation",
        //       httpCode: HttpCode.BAD_REQUEST,
        //     })
        //   );
        const createANewAdmin = yield admin_model_1.AdminModel.create({
            adminEmail,
            isAdmin,
            isSuperAdmin,
            name,
            adminPassword: hashPassword,
        });
        if (!createANewAdmin)
            next(new AppError_1.AppError({
                message: "Couldn't create an amdin",
                httpCode: AppError_1.HttpCode.BAD_REQUEST,
            }));
        return res === null || res === void 0 ? void 0 : res.status(AppError_1.HttpCode.SUCCESSFUL).json({
            message: "Created successfull",
            password: adminPasswordgenerated,
        });
    }
}));
// register a cell
exports.registerANewCell = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { name, cellEmail } = req.body;
    const findUser = yield cell_model_1.CellModel.findOne({ cellEmail });
    if (findUser) {
        next(new AppError_1.AppError({
            message: "This email is already registered to a cell",
            httpCode: AppError_1.HttpCode.BAD_REQUEST,
        }));
    }
    else {
        const findAdmin = yield admin_model_1.AdminModel.findById((_a = req === null || req === void 0 ? void 0 : req.admin) === null || _a === void 0 ? void 0 : _a._id);
        const cellPassword = generateRandomPassword();
        const genSalt = yield hashPasswordUsingBcrypt(cellPassword);
        if (((_b = req === null || req === void 0 ? void 0 : req.admin) === null || _b === void 0 ? void 0 : _b.isSuperAdmin) || ((_c = req === null || req === void 0 ? void 0 : req.admin) === null || _c === void 0 ? void 0 : _c.isAdmin)) {
            const newCell = new cell_model_1.CellModel({
                cellEmail,
                cellPassword: genSalt,
                name: name,
            });
            newCell.cellAdminId = findAdmin;
            yield newCell.save();
            (_d = findAdmin === null || findAdmin === void 0 ? void 0 : findAdmin.cells) === null || _d === void 0 ? void 0 : _d.push(new mongoose_1.default.Types.ObjectId(newCell._id));
            yield (findAdmin === null || findAdmin === void 0 ? void 0 : findAdmin.save());
            res
                .status(AppError_1.HttpCode.OK)
                .json({ message: "Cell created with newest password", data: cellPassword });
        }
        else {
            next(new AppError_1.AppError({
                message: "You don't have right for this operation",
                httpCode: AppError_1.HttpCode.BAD_REQUEST,
            }));
        }
        // return res.status(HttpCode.SUCCESSFUL).json({message: "New User Created", data: createACellOrAnAdmin})
    }
}));
// login an admin
exports.loginAnAdmin = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { adminEmail, adminPassword } = req.body;
    const findUser = yield admin_model_1.AdminModel.findOne({ adminEmail });
    if (!findUser) {
        return res
            .status(AppError_1.HttpCode.NOT_FOUND)
            .json({ message: "Invalid Credentials" });
    }
    else {
        const comparePassword = yield bcrypt_1.default.compare(adminPassword, findUser.adminPassword);
        if (!comparePassword) {
            return res
                .status(AppError_1.HttpCode.BAD_REQUEST)
                .json({ message: "Invalid Credentials" });
        }
        else {
            if (findUser === null || findUser === void 0 ? void 0 : findUser.isFirstTimeLogin) {
                // verify email
                const generateVerifyKey = otp_generator_1.default.generate(25);
                const generateOtp = otp_generator_1.default.generate(6, {
                    upperCaseAlphabets: false,
                    digits: true,
                    lowerCaseAlphabets: false,
                    specialChars: false,
                });
                const sentMail = sendTwoFactorAuthorizationByEmail(generateOtp, adminEmail, generateVerifyKey);
                if (!sentMail)
                    next(new AppError_1.AppError({
                        message: "Mail failed to send, retry this step",
                        httpCode: AppError_1.HttpCode.BAD_REQUEST,
                    }));
                return res
                    .status(AppError_1.HttpCode.OK)
                    .json({
                    message: "Please verify your email",
                    data: {
                        verificationKey: generateVerifyKey,
                        isAdmin: true,
                        email: adminEmail,
                    },
                });
            }
            else {
                const adminDetails = {
                    _id: findUser === null || findUser === void 0 ? void 0 : findUser._id,
                    name: findUser === null || findUser === void 0 ? void 0 : findUser.name,
                    isFirstTimeLogin: findUser === null || findUser === void 0 ? void 0 : findUser.isFirstTimeLogin,
                    adminEmail: findUser === null || findUser === void 0 ? void 0 : findUser.adminEmail,
                    image: findUser === null || findUser === void 0 ? void 0 : findUser.image,
                    isEmailVerfiied: findUser === null || findUser === void 0 ? void 0 : findUser.isEmailVerified,
                    isAdmin: findUser === null || findUser === void 0 ? void 0 : findUser.isAdmin,
                    isSuperAdmin: findUser === null || findUser === void 0 ? void 0 : findUser.isSuperAdmin,
                };
                const token = generateJwt(adminDetails);
                // generate response
                res
                    .status(AppError_1.HttpCode.SUCCESSFUL)
                    .json({ message: "Login Successfully", data: { findUser, token } });
            }
        }
    }
}));
// login a cell
exports.loginACell = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { cellEmail, cellPassword } = req.body;
    const findUser = yield cell_model_1.CellModel.findOne({ cellEmail });
    if (!findUser) {
        return res
            .status(AppError_1.HttpCode.NOT_FOUND)
            .json({ message: "Invalid Credentials" });
    }
    else {
        const comparePassword = yield bcrypt_1.default.compare(cellPassword, findUser.cellPassword);
        if (!comparePassword) {
            return res
                .status(AppError_1.HttpCode.BAD_REQUEST)
                .json({ message: "Invalid Credentials" });
        }
        else {
            if (findUser === null || findUser === void 0 ? void 0 : findUser.isFirstTimeLogin) {
                // verify email
                const generateVerifyKey = otp_generator_1.default.generate(25);
                const generateOtp = otp_generator_1.default.generate(6, {
                    upperCaseAlphabets: false,
                    specialChars: false,
                    digits: true,
                    lowerCaseAlphabets: false,
                });
                const sentMail = sendTwoFactorAuthorizationByEmail(generateOtp, cellEmail, generateVerifyKey);
                if (!sentMail)
                    next(new AppError_1.AppError({
                        message: "Mail failed to send, retry this step",
                        httpCode: AppError_1.HttpCode.BAD_REQUEST,
                    }));
                return res
                    .status(AppError_1.HttpCode.OK)
                    .json({
                    message: "Please verify your email",
                    data: {
                        verificationKey: generateVerifyKey,
                        isAdmin: false,
                        email: cellEmail,
                    },
                });
            }
            else {
                // generate token
                const cellDetails = {
                    _id: findUser === null || findUser === void 0 ? void 0 : findUser._id,
                    name: findUser === null || findUser === void 0 ? void 0 : findUser.name,
                    isFirstTimeLogin: findUser === null || findUser === void 0 ? void 0 : findUser.isFirstTimeLogin,
                    cellEmail: findUser === null || findUser === void 0 ? void 0 : findUser.cellEmail,
                    cellLeaderName: findUser === null || findUser === void 0 ? void 0 : findUser.cellLeaderName,
                    image: findUser === null || findUser === void 0 ? void 0 : findUser.image,
                    isEmailVerfiied: findUser === null || findUser === void 0 ? void 0 : findUser.isEmailVerified,
                    cellAdminId: findUser === null || findUser === void 0 ? void 0 : findUser.cellAdminId,
                };
                const token = generateJwt(cellDetails);
                // generate response
                res
                    .status(AppError_1.HttpCode.SUCCESSFUL)
                    .json({ message: "Login Successfully", data: { findUser, token } });
            }
        }
    }
}));
// email verification end point for cell
exports.verifyEmailForCell = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, verificationKey, otp } = req.body;
        const otpHolder = yield otp_model_1.OtpModel.find({ email });
        if (otpHolder.length === 0) {
            res
                .status(AppError_1.HttpCode.NOT_FOUND)
                .json({ message: "You use an expired OTP" });
        }
        else {
            const rightOtpFind = otpHolder[otpHolder.length - 1];
            const validUser = yield bcrypt_1.default.compare(otp, rightOtpFind.otp);
            const validVerificationKey = yield bcrypt_1.default.compare(verificationKey, rightOtpFind.verificationKey);
            if (validVerificationKey) {
                if (validUser) {
                    const findUser = yield cell_model_1.CellModel.findOneAndUpdate({ cellEmail: email }, { isEmailVerified: true, isFirstTimeLogin: false }, { new: true });
                    const userDetails = {
                        _id: findUser === null || findUser === void 0 ? void 0 : findUser._id,
                        name: findUser === null || findUser === void 0 ? void 0 : findUser.name,
                        isFirstTimeLogin: findUser === null || findUser === void 0 ? void 0 : findUser.isFirstTimeLogin,
                        cellEmail: findUser === null || findUser === void 0 ? void 0 : findUser.cellEmail,
                        cellLeaderName: findUser === null || findUser === void 0 ? void 0 : findUser.cellLeaderName,
                        image: findUser === null || findUser === void 0 ? void 0 : findUser.image,
                        isEmailVerfiied: findUser === null || findUser === void 0 ? void 0 : findUser.isEmailVerified,
                        cellAdminId: findUser === null || findUser === void 0 ? void 0 : findUser.cellAdminId,
                    };
                    const token = generateJwt(userDetails);
                    yield otp_model_1.OtpModel.deleteMany({ email: rightOtpFind.email });
                    res
                        .status(AppError_1.HttpCode.OK)
                        .json({
                        message: "Email Verified Successfully",
                        data: { data: findUser, token: token },
                    });
                }
                else {
                    res.status(AppError_1.HttpCode.BAD_REQUEST).json({ message: "Invalid OTP" });
                }
            }
            else {
                res
                    .status(AppError_1.HttpCode.BAD_REQUEST)
                    .json({ message: "Expired Verification Key" });
            }
        }
    }
    catch (error) {
        res === null || res === void 0 ? void 0 : res.status(AppError_1.HttpCode.UNPROCESSIBLE_IDENTITY).json({ message: error });
    }
}));
// email verification end point for admin
exports.verifyEmailForAdmin = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, verificationKey, otp } = req.body;
    const otpHolder = yield otp_model_1.OtpModel.find({ email });
    if (otpHolder.length === 0) {
        res
            .status(AppError_1.HttpCode.NOT_FOUND)
            .json({ message: "You use an expired OTP" });
    }
    else {
        const rightOtpFind = otpHolder[otpHolder.length - 1];
        const validUser = yield bcrypt_1.default.compare(otp, rightOtpFind.otp);
        const validVerificationKey = yield bcrypt_1.default.compare(verificationKey, rightOtpFind.verificationKey);
        if (validVerificationKey) {
            if (validUser) {
                const findUser = yield admin_model_1.AdminModel.findOneAndUpdate({ adminEmail: email }, { isEmailVerified: true, isFirstTimeLogin: false }, { new: true });
                const adminDetails = {
                    _id: findUser === null || findUser === void 0 ? void 0 : findUser._id,
                    name: findUser === null || findUser === void 0 ? void 0 : findUser.name,
                    isFirstTimeLogin: findUser === null || findUser === void 0 ? void 0 : findUser.isFirstTimeLogin,
                    adminEmail: findUser === null || findUser === void 0 ? void 0 : findUser.adminEmail,
                    image: findUser === null || findUser === void 0 ? void 0 : findUser.image,
                    isEmailVerfiied: findUser === null || findUser === void 0 ? void 0 : findUser.isEmailVerified,
                    isAdmin: findUser === null || findUser === void 0 ? void 0 : findUser.isAdmin,
                    isSuperAdmin: findUser === null || findUser === void 0 ? void 0 : findUser.isSuperAdmin,
                };
                const token = generateJwt(adminDetails);
                yield otp_model_1.OtpModel.deleteMany({ email: rightOtpFind.email });
                res
                    .status(AppError_1.HttpCode.OK)
                    .json({
                    message: "Email Verified Successfully",
                    data: { data: findUser, token: token },
                });
            }
            else {
                res.status(AppError_1.HttpCode.BAD_REQUEST).json({ message: "Invalid OTP" });
            }
        }
        else {
            res
                .status(AppError_1.HttpCode.BAD_REQUEST)
                .json({ message: "Expired Verification Key" });
        }
    }
}));
// resend otp for email verification end point
exports.resendVerificationEmailOtpForAdmin = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const generatedOtp = otp_generator_1.default.generate(6, {
        digits: true,
        specialChars: false,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
    });
    const generatedVerificationKey = otp_generator_1.default.generate(25);
    const saltValue = yield bcrypt_1.default.genSalt(10);
    const otpModel = new otp_model_1.OtpModel({
        otp: generatedOtp,
        verificationKey: generatedVerificationKey,
        email: email,
    });
    console.log(generatedOtp);
    otpModel.otp = yield bcrypt_1.default.hash(otpModel.otp, saltValue);
    otpModel.verificationKey = yield bcrypt_1.default.hash(otpModel.verificationKey, saltValue);
    otpModel.save();
    (0, sendMail_1.sendEmailToUsers)(email, "Email Verification", `<h3>Use this otp to verify your email ${generatedOtp}. Otp expires after 10mins</h3>`);
    res
        .status(AppError_1.HttpCode.SUCCESSFUL)
        .json({
        message: "Otp has been sent",
        data: { type: "email", verificationKey: generatedVerificationKey,
            email: email,
            isAdmin: true },
    });
}));
// reset password for cell
exports.resetPassword = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const { currentPassword, newPassword } = req.body;
    const userEmail = (_e = req === null || req === void 0 ? void 0 : req.cell) === null || _e === void 0 ? void 0 : _e.cellEmail;
    const findUser = yield cell_model_1.CellModel.findOne({ cellEmail: userEmail });
    if (!findUser) {
        res.status(AppError_1.HttpCode.NOT_FOUND).json({ message: "User not found" });
    }
    else {
        const verifyPassword = yield bcrypt_1.default.compare(currentPassword, findUser === null || findUser === void 0 ? void 0 : findUser.cellPassword);
        if (!verifyPassword) {
            res
                .status(AppError_1.HttpCode.BAD_REQUEST)
                .json({ message: "Incorrect Current Password" });
        }
        else {
            const hashPassword = yield hashPasswordUsingBcrypt(newPassword);
            const updateUser = yield (cell_model_1.CellModel === null || cell_model_1.CellModel === void 0 ? void 0 : cell_model_1.CellModel.findByIdAndUpdate(findUser === null || findUser === void 0 ? void 0 : findUser._id, { cellPassword: hashPassword }, { new: true }));
            res
                .status(AppError_1.HttpCode.SUCCESSFUL)
                .json({ message: "Password Reset Successfully" });
        }
    }
}));
// reset password for admin
exports.resetPasswordForAdmin = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    const { currentPassword, newPassword } = req.body;
    const userEmail = (_f = req === null || req === void 0 ? void 0 : req.admin) === null || _f === void 0 ? void 0 : _f.adminEmail;
    const findUser = yield admin_model_1.AdminModel.findOne({ adminEmail: userEmail });
    if (!findUser) {
        res.status(AppError_1.HttpCode.NOT_FOUND).json({ message: "User not found" });
    }
    else {
        const verifyPassword = yield bcrypt_1.default.compare(currentPassword, findUser === null || findUser === void 0 ? void 0 : findUser.adminPassword);
        if (!verifyPassword) {
            res
                .status(AppError_1.HttpCode.BAD_REQUEST)
                .json({ message: "Incorrect Current Password" });
        }
        else {
            const hashPassword = yield hashPasswordUsingBcrypt(newPassword);
            const updateUser = yield (admin_model_1.AdminModel === null || admin_model_1.AdminModel === void 0 ? void 0 : admin_model_1.AdminModel.findByIdAndUpdate(findUser === null || findUser === void 0 ? void 0 : findUser._id, { adminPassword: hashPassword }, { new: true }));
            res
                .status(AppError_1.HttpCode.SUCCESSFUL)
                .json({ message: "Password Reset Successfully" });
        }
    }
}));
//  update user cell data
exports.updateCellData = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h;
    try {
        const { cellLeaderName, bio, maritalStatus } = req.body;
        const imageFile = (_g = req === null || req === void 0 ? void 0 : req.file) === null || _g === void 0 ? void 0 : _g.path;
        const imageUpload = yield cloudinary_1.default.uploader.upload(imageFile);
        const updateCellData = yield cell_model_1.CellModel.findByIdAndUpdate((_h = req === null || req === void 0 ? void 0 : req.cell) === null || _h === void 0 ? void 0 : _h._id, { cellLeaderName: cellLeaderName,
            bio: bio,
            maritalStatus: maritalStatus,
            image: imageUpload === null || imageUpload === void 0 ? void 0 : imageUpload.secure_url,
        }, { new: true });
        res
            .status(AppError_1.HttpCode.SUCCESSFUL)
            .json({ message: "Updated Successfully", data: updateCellData });
    }
    catch (err) {
        res === null || res === void 0 ? void 0 : res.status(AppError_1.HttpCode.UNPROCESSIBLE_IDENTITY).json({ message: err });
    }
}));
//  update admin  data
exports.updateAdminData = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _j, _k;
    try {
        const { adminFullName, bio, maritalStatus, leaderShipPosition } = req.body;
        const imageFile = (_j = req === null || req === void 0 ? void 0 : req.file) === null || _j === void 0 ? void 0 : _j.path;
        const imageUpload = yield cloudinary_1.default.uploader.upload(imageFile);
        const updateCellData = yield admin_model_1.AdminModel.findByIdAndUpdate((_k = req === null || req === void 0 ? void 0 : req.admin) === null || _k === void 0 ? void 0 : _k._id, { adminFullName: adminFullName,
            leaderShipPosition: leaderShipPosition,
            bio: bio,
            maritalStatus: maritalStatus,
            image: imageUpload === null || imageUpload === void 0 ? void 0 : imageUpload.secure_url,
        }, { new: true });
        res
            .status(AppError_1.HttpCode.SUCCESSFUL)
            .json({ message: "Updated Successfully", data: updateCellData });
    }
    catch (err) {
        res === null || res === void 0 ? void 0 : res.status(AppError_1.HttpCode.UNPROCESSIBLE_IDENTITY).json({ message: err });
    }
}));
// get all cells
exports.getAllCells = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allCells = yield cell_model_1.CellModel.find();
    res.status(AppError_1.HttpCode.OK).json({ message: "All Cells", data: allCells });
}));
// get cells for one admin
exports.getAllCellsForOneAdmin = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _l;
    const userId = (_l = req === null || req === void 0 ? void 0 : req.admin) === null || _l === void 0 ? void 0 : _l._id;
    const allCells = yield cell_model_1.CellModel.find({ cellAdminId: userId });
    res.status(AppError_1.HttpCode.OK).json({ message: "All Cells", data: allCells });
}));
// get current cell user
exports.currentCellUser = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _m;
    try {
        const userId = (_m = req === null || req === void 0 ? void 0 : req.cell) === null || _m === void 0 ? void 0 : _m._id;
        console.log(userId);
        const currentCell = yield cell_model_1.CellModel.findById(userId);
        console.log(currentCell);
        res.status(AppError_1.HttpCode.OK).json({ message: "Me", data: currentCell });
    }
    catch (error) {
        res === null || res === void 0 ? void 0 : res.status(AppError_1.HttpCode.UNPROCESSIBLE_IDENTITY).json({ message: error });
    }
}));
// get a single cell user
exports.oneCellUser = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const currentCell = yield cell_model_1.CellModel.findById(userId);
        console.log(currentCell);
        res.status(AppError_1.HttpCode.OK).json({ message: "One Cell User", data: currentCell });
    }
    catch (error) {
        res === null || res === void 0 ? void 0 : res.status(AppError_1.HttpCode.UNPROCESSIBLE_IDENTITY).json({ message: error });
    }
}));
// get a single admin user
exports.oneAdminUser = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const oneAdminUser = yield admin_model_1.AdminModel.findById(userId);
        console.log(oneAdminUser);
        res.status(AppError_1.HttpCode.OK).json({ message: "One admin User", data: oneAdminUser });
    }
    catch (error) {
        res === null || res === void 0 ? void 0 : res.status(AppError_1.HttpCode.UNPROCESSIBLE_IDENTITY).json({ message: error });
    }
}));
// suspend cell
exports.suspendACell = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const currentCell = yield cell_model_1.CellModel.findByIdAndUpdate(id, { isSuspended: true }, { new: true });
        console.log(currentCell);
        res.status(AppError_1.HttpCode.OK).json({ message: "Me", data: currentCell });
    }
    catch (error) {
        res === null || res === void 0 ? void 0 : res.status(AppError_1.HttpCode.UNPROCESSIBLE_IDENTITY).json({ message: error });
    }
}));
// unsuspend a cell
exports.unSuspendACell = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const currentCell = yield cell_model_1.CellModel.findByIdAndUpdate(id, { isSuspended: false }, { new: true });
        console.log(currentCell);
        res.status(AppError_1.HttpCode.OK).json({ message: "Me", data: currentCell });
    }
    catch (error) {
        res === null || res === void 0 ? void 0 : res.status(AppError_1.HttpCode.UNPROCESSIBLE_IDENTITY).json({ message: error });
    }
}));
