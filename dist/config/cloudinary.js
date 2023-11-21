"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const EnvironmentalVariables_1 = require("./EnvironmentalVariables");
cloudinary_1.v2.config({
    cloud_name: EnvironmentalVariables_1.environmentalVariables.CLOUD_NAME,
    api_key: EnvironmentalVariables_1.environmentalVariables.CLOUD_API_KEY,
    api_secret: EnvironmentalVariables_1.environmentalVariables.CLOUD_API_SECRET,
    secure: true
});
exports.default = cloudinary_1.v2;
