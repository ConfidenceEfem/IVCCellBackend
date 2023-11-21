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
exports.sendEmailToUsers = void 0;
const EnvironmentalVariables_1 = require("./EnvironmentalVariables");
const nodemailer_1 = __importDefault(require("nodemailer"));
const googleapis_1 = require("googleapis");
const AppError_1 = require("../utils/AppError");
const oAuthPass = new googleapis_1.google.auth.OAuth2(EnvironmentalVariables_1.environmentalVariables.CLIENT_ID, EnvironmentalVariables_1.environmentalVariables.CLIENT_SECRET, EnvironmentalVariables_1.environmentalVariables.REDIRECT_URL);
oAuthPass.setCredentials({ refresh_token: EnvironmentalVariables_1.environmentalVariables.REFRESH_TOKEN });
const sendEmailToUsers = (email, title, content, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createToken = yield oAuthPass.getAccessToken();
        const transporter = nodemailer_1.default.createTransport({
            service: 'Gmail',
            auth: {
                type: 'OAuth2',
                user: 'smartdevopss@gmail.com',
                clientId: EnvironmentalVariables_1.environmentalVariables.CLIENT_ID,
                clientSecret: EnvironmentalVariables_1.environmentalVariables.CLIENT_SECRET,
                refreshToken: EnvironmentalVariables_1.environmentalVariables.REFRESH_TOKEN,
                accessToken: createToken.token
            },
        });
        const mailOptions = {
            from: `Auth Pratice <"confidenceefem1@gmail.com">`,
            to: email,
            subject: `${title}`,
            html: `${content}`,
        };
        const result = transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err.message);
                if (res !== undefined) {
                    res.status(AppError_1.HttpCode.UNPROCESSIBLE_IDENTITY).json({ message: err.message });
                }
            }
            else {
                console.log(info.response);
            }
        });
        return result;
    }
    catch (error) {
        console.log(error);
        return error;
    }
});
exports.sendEmailToUsers = sendEmailToUsers;
