import { Icell } from "../interface/cell.interface";
import { AsyncHandler } from "../utils/AsyncHandler";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { CellModel } from "../model/cell.model";
import { AppError, HttpCode } from "../utils/AppError";
import jwt from "jsonwebtoken";
import { environmentalVariables } from "../config/EnvironmentalVariables";
import otpGenerator from "otp-generator";
import { sendEmailToUsers } from "../config/sendMail";
import { OtpModel } from "../model/otp.model";
import { Iadmin } from "../interface/admin.interface";
import { AdminModel } from "../model/admin.model";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary";

const hashPasswordUsingBcrypt = async (cellPassword: string) => {
  const genSalt = await bcrypt.genSalt(10);

  const hashPassword = await bcrypt.hash(cellPassword, genSalt);

  return hashPassword;
};

const generateJwt = (payload: Object) => {
  const token = jwt.sign(payload, environmentalVariables.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });

  return token;
};

// generate random password
const generateRandomPassword = () => {
  const randomPassword = otpGenerator.generate(8, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    digits: true,
    specialChars:false
  });

  return randomPassword;
};

// send mail for email verification when you log in for first time

const sendTwoFactorAuthorizationByEmail = async (
  otp: string,
  email: string,
  verificationKey: string
) => {
  const salt = await bcrypt.genSalt(10);

  const otpObject = new OtpModel({
    verificationKey: verificationKey,
    otp: otp,
    email: email,
  });

  otpObject.verificationKey = await bcrypt.hash(
    otpObject.verificationKey,
    salt
  );
  otpObject.otp = await bcrypt.hash(otpObject.otp, salt);

  otpObject.save();

  console.log(otp);

  sendEmailToUsers(
    email,
    "Complete Two Factor Authorization",
    `<h4>Copy and paste the otp : ${otp} to complete your 2FA. Otp expires in 5 minutess</h4>`
  );
};

// register an admin
export const registerAnAdmin = AsyncHandler(
  async (req: Request<{}, {}, Iadmin>, res: Response, next: NextFunction) => {
    const { adminEmail, isAdmin, isSuperAdmin, name, adminPassword } = req.body;

    const findIfAdminExist = await AdminModel.findOne({ adminEmail });
    if (findIfAdminExist) {
      next(
        new AppError({
          message: "This email is already registered to a church",
          httpCode: HttpCode.BAD_REQUEST,
        })
      );
    } else {
      const adminPasswordgenerated = generateRandomPassword();

      const hashPassword = await hashPasswordUsingBcrypt(
        adminPasswordgenerated
      );
      // const hashPassword = await hashPasswordUsingBcrypt(adminPassword)

      if (!req?.admin?.isSuperAdmin)
        next(
          new AppError({
            message: "You don't have right to perform this operation",
            httpCode: HttpCode.BAD_REQUEST,
          })
        );

      const createANewAdmin = await AdminModel.create({
        adminEmail,
        isAdmin,
        isSuperAdmin,
        name,
        adminPassword: hashPassword,
      });

      if (!createANewAdmin)
        next(
          new AppError({
            message: "Couldn't create an amdin",
            httpCode: HttpCode.BAD_REQUEST,
          })
        );

      return res
        ?.status(HttpCode.SUCCESSFUL)
        .json({
          message: "Created successfully with newest password",
          password: adminPasswordgenerated,
        });
    }
  }
);

// register a cell
export const registerANewCell = AsyncHandler(
  async (req: Request<{}, {}, Icell>, res: Response, next: NextFunction) => {
    const { name, cellEmail } = req.body;

    const findUser: any = await CellModel.findOne({ cellEmail });
    if (findUser) {
      next(
        new AppError({
          message: "This email is already registered to a cell",
          httpCode: HttpCode.BAD_REQUEST,
        })
      );
    } else {
      const findAdmin = await AdminModel.findById(req?.admin?._id);

      const cellPassword = generateRandomPassword();

      const genSalt = await hashPasswordUsingBcrypt(cellPassword);

      if (req?.admin?.isSuperAdmin || req?.admin?.isAdmin) {
        const newCell = new CellModel({
          cellEmail,
          cellPassword: genSalt,
          name: name,
        });

        newCell.cellAdminId = findAdmin;

        await newCell.save();

        findAdmin?.cells?.push(new mongoose.Types.ObjectId(newCell._id));

        await findAdmin?.save();

        res
          .status(HttpCode.OK)
          .json({ message: "Cell created with newest password", data: cellPassword });
      } else {
        next(
          new AppError({
            message: "You don't have right for this operation",
            httpCode: HttpCode.BAD_REQUEST,
          })
        );
      }

      // return res.status(HttpCode.SUCCESSFUL).json({message: "New User Created", data: createACellOrAnAdmin})
    }
  }
);

// login an admin
export const loginAnAdmin = AsyncHandler(
  async (req: Request<{}, {}, Iadmin>, res: Response, next: NextFunction) => {
    const { adminEmail, adminPassword } = req.body;

    const findUser = await AdminModel.findOne({ adminEmail });
    if (!findUser) {
      return res
        .status(HttpCode.NOT_FOUND)
        .json({ message: "Invalid Credentials" });
    } else {
      const comparePassword = await bcrypt.compare(
        adminPassword,
        findUser.adminPassword
      );
      if (!comparePassword) {
        return res
          .status(HttpCode.BAD_REQUEST)
          .json({ message: "Invalid Credentials" });
      } else {
        if (findUser?.isFirstTimeLogin) {
          // verify email

          const generateVerifyKey = otpGenerator.generate(25);

          const generateOtp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            digits: true,
            lowerCaseAlphabets: false,
            specialChars:false,
          });

          const sentMail = sendTwoFactorAuthorizationByEmail(
            generateOtp,
            adminEmail,
            generateVerifyKey
          );

          if (!sentMail)
            next(
              new AppError({
                message: "Mail failed to send, retry this step",
                httpCode: HttpCode.BAD_REQUEST,
              })
            );

          return res
            .status(HttpCode.OK)
            .json({
              message: "Please verify your email",
              data: {
                verificationKey: generateVerifyKey,
                isAdmin: true,
                email: adminEmail,
              },
            });
        } else {
          const adminDetails = {
            _id: findUser?._id,
            name: findUser?.name,
            isFirstTimeLogin: findUser?.isFirstTimeLogin,
            adminEmail: findUser?.adminEmail,
            image: findUser?.image,
            isEmailVerfiied: findUser?.isEmailVerified,
            isAdmin: findUser?.isAdmin,
            isSuperAdmin: findUser?.isSuperAdmin,
          };
          const token = generateJwt(adminDetails);

          // generate response

          res
            .status(HttpCode.SUCCESSFUL)
            .json({ message: "Login Successfully", data: { findUser, token } });
        }
      }
    }
  }
);

// login a cell
export const loginACell = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { cellEmail, cellPassword } = req.body;

    const findUser = await CellModel.findOne({ cellEmail });
    if (!findUser) {
      return res
        .status(HttpCode.NOT_FOUND)
        .json({ message: "Invalid Credentials" });
    } else {
      const comparePassword = await bcrypt.compare(
        cellPassword,
        findUser.cellPassword
      );
      if (!comparePassword) {
        return res
          .status(HttpCode.BAD_REQUEST)
          .json({ message: "Invalid Credentials" });
      } else {
        if (findUser?.isFirstTimeLogin) {
          // verify email

          const generateVerifyKey = otpGenerator.generate(25);

          const generateOtp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            digits: true,
            lowerCaseAlphabets: false,
          });

          const sentMail = sendTwoFactorAuthorizationByEmail(
            generateOtp,
            cellEmail,
            generateVerifyKey
          );

          if (!sentMail)
            next(
              new AppError({
                message: "Mail failed to send, retry this step",
                httpCode: HttpCode.BAD_REQUEST,
              })
            );

          return res
            .status(HttpCode.OK)
            .json({
              message: "Please verify your email",
              data: {
                verificationKey: generateVerifyKey,
                isAdmin: false,
                email: cellEmail,
              },
            });
        } else {
          // generate token

          

          const cellDetails = {
            _id: findUser?._id,
            name: findUser?.name,
            isFirstTimeLogin: findUser?.isFirstTimeLogin,
            cellEmail: findUser?.cellEmail,
            cellLeaderName: findUser?.cellLeaderName,
            image: findUser?.image,
            isEmailVerfiied: findUser?.isEmailVerified,
            cellAdminId: findUser?.cellAdminId,
          };
          const token = generateJwt(cellDetails);

          // generate response

          res
            .status(HttpCode.SUCCESSFUL)
            .json({ message: "Login Successfully", data: { findUser, token } });
        }
      }
    }
  }
);

// email verification end point for cell
export const verifyEmailForCell = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, verificationKey, otp } = req.body;

      const otpHolder = await OtpModel.find({ email });
      if (otpHolder.length === 0) {
        res
          .status(HttpCode.NOT_FOUND)
          .json({ message: "You use an expired OTP" });
      } else {
        const rightOtpFind = otpHolder[otpHolder.length - 1];
        const validUser = await bcrypt.compare(otp, rightOtpFind.otp);
        const validVerificationKey = await bcrypt.compare(
          verificationKey,
          rightOtpFind.verificationKey
        );
        if (validVerificationKey) {
          if (validUser) {
            const findUser = await CellModel.findOneAndUpdate(
              { cellEmail: email },
              { isEmailVerified: true, isFirstTimeLogin: false },
              { new: true }
            );

            const userDetails = {
              _id: findUser?._id,
            name: findUser?.name,
            isFirstTimeLogin: findUser?.isFirstTimeLogin,
            cellEmail: findUser?.cellEmail,
            cellLeaderName: findUser?.cellLeaderName,
            image: findUser?.image,
            isEmailVerfiied: findUser?.isEmailVerified,
            cellAdminId: findUser?.cellAdminId,
            };
            const token = generateJwt(userDetails);

            await OtpModel.deleteMany({ email: rightOtpFind.email });

            res
              .status(HttpCode.OK)
              .json({
                message: "Email Verified Successfully",
                data: { data: findUser, token: token },
              });
          } else {
            res.status(HttpCode.BAD_REQUEST).json({ message: "Invalid OTP" });
          }
        } else {
          res
            .status(HttpCode.BAD_REQUEST)
            .json({ message: "Expired Verification Key" });
        }
      }
    } catch (error) {
      res?.status(HttpCode.UNPROCESSIBLE_IDENTITY).json({ message: error });
    }
  }
);

// email verification end point for admin
export const verifyEmailForAdmin = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, verificationKey, otp } = req.body;

    const otpHolder = await OtpModel.find({ email });
    if (otpHolder.length === 0) {
      res
        .status(HttpCode.NOT_FOUND)
        .json({ message: "You use an expired OTP" });
    } else {
      const rightOtpFind = otpHolder[otpHolder.length - 1];
      const validUser = await bcrypt.compare(otp, rightOtpFind.otp);
      const validVerificationKey = await bcrypt.compare(
        verificationKey,
        rightOtpFind.verificationKey
      );
      if (validVerificationKey) {
        if (validUser) {
          const findUser = await AdminModel.findOneAndUpdate(
            { adminEmail: email },
            { isEmailVerified: true, isFirstTimeLogin: false },
            { new: true }
          );

          const adminDetails = {
            _id: findUser?._id,
            name: findUser?.name,
            isFirstTimeLogin: findUser?.isFirstTimeLogin,
            adminEmail: findUser?.adminEmail,
            image: findUser?.image,
            isEmailVerfiied: findUser?.isEmailVerified,
            isAdmin: findUser?.isAdmin,
            isSuperAdmin: findUser?.isSuperAdmin,
          };
          const token = generateJwt(adminDetails);

          await OtpModel.deleteMany({ email: rightOtpFind.email });

          res
            .status(HttpCode.OK)
            .json({
              message: "Email Verified Successfully",
              data: { data: findUser, token: token },
            });
        } else {
          res.status(HttpCode.BAD_REQUEST).json({ message: "Invalid OTP" });
        }
      } else {
        res
          .status(HttpCode.BAD_REQUEST)
          .json({ message: "Expired Verification Key" });
      }
    }
  }
);

// resend otp for email verification end point
export const resendVerificationEmailOtpForAdmin = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const generatedOtp = otpGenerator.generate(6, {
      digits: true,
      specialChars: false,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
    });

    const generatedVerificationKey = otpGenerator.generate(25);

    const saltValue = await bcrypt.genSalt(10);

    const otpModel = new OtpModel({
      otp: generatedOtp,
      verificationKey: generatedVerificationKey,
      email: email,
    });

    console.log(generatedOtp);

    otpModel.otp = await bcrypt.hash(otpModel.otp, saltValue);
    otpModel.verificationKey = await bcrypt.hash(
      otpModel.verificationKey,
      saltValue
    );

    otpModel.save();

    sendEmailToUsers(
      email,
      "Email Verification",
      `<h3>Use this otp to verify your email ${generatedOtp}. Otp expires after 10mins</h3>`
    );

    res
      .status(HttpCode.SUCCESSFUL)
      .json({
        message: "Otp has been sent",
        data: { type: "email", verificationKey: generatedVerificationKey,
      email: email,
    isAdmin: true },
      });
  }
);

// reset password for cell

export const resetPassword = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword } = req.body;

    const userEmail = req?.cell?.cellEmail;

    const findUser: any = await CellModel.findOne({ cellEmail: userEmail });

    if (!findUser) {
      res.status(HttpCode.NOT_FOUND).json({ message: "User not found" });
    } else {
      const verifyPassword = await bcrypt.compare(
        currentPassword,
        findUser?.cellPassword
      );
      if (!verifyPassword) {
        res
          .status(HttpCode.BAD_REQUEST)
          .json({ message: "Incorrect Current Password" });
      } else {
        const hashPassword = await hashPasswordUsingBcrypt(newPassword);

        const updateUser = await CellModel?.findByIdAndUpdate(
          findUser?._id,
          { cellPassword: hashPassword },
          { new: true }
        );

        res
          .status(HttpCode.SUCCESSFUL)
          .json({ message: "Password Reset Successfully" });
      }
    }
  }
);

// reset password for admin
export const resetPasswordForAdmin = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword } = req.body;

    const userEmail = req?.admin?.adminEmail;

    const findUser: any = await AdminModel.findOne({ adminEmail: userEmail });
    if (!findUser) {
      res.status(HttpCode.NOT_FOUND).json({ message: "User not found" });
    } else {
      const verifyPassword = await bcrypt.compare(
        currentPassword,
        findUser?.adminPassword
      );
      if (!verifyPassword) {
        res
          .status(HttpCode.BAD_REQUEST)
          .json({ message: "Incorrect Current Password" });
      } else {
        const hashPassword = await hashPasswordUsingBcrypt(newPassword);

        const updateUser = await AdminModel?.findByIdAndUpdate(
          findUser?._id,
          { adminPassword: hashPassword },
          { new: true }
        );

        res
          .status(HttpCode.SUCCESSFUL)
          .json({ message: "Password Reset Successfully" });
      }
    }
  }
);

//  update user cell data

export const updateCellData = AsyncHandler(
  async (req: Request<{}, {}, Icell>, res: Response, next: NextFunction) => {
    try {
      const { cellLeaderName,bio, maritalStatus} = req.body;

      

      const imageFile  = req?.file?.path as string

      const imageUpload = await cloudinary.uploader.upload(imageFile)

   

      const updateCellData = await CellModel.findByIdAndUpdate(
        req?.cell?._id,
        { cellLeaderName: cellLeaderName,
          bio: bio,
          maritalStatus: maritalStatus,
        image:imageUpload?.secure_url,

       },
        { new: true }
      );

      

      res
        .status(HttpCode.SUCCESSFUL)
        .json({ message: "Updated Successfully", data: updateCellData });
    } catch (err) {
      res?.status(HttpCode.UNPROCESSIBLE_IDENTITY).json({ message: err });
    }
  }
);

//  update admin  data

export const updateAdminData = AsyncHandler(
  async (req: Request<{}, {}, Iadmin>, res: Response, next: NextFunction) => {
    try {
      const { adminFullName,bio, maritalStatus,leaderShipPosition} = req.body;

      

      const imageFile  = req?.file?.path as string

      const imageUpload = await cloudinary.uploader.upload(imageFile)

   

      const updateCellData = await AdminModel.findByIdAndUpdate(
        req?.admin?._id,
        { adminFullName: adminFullName,
          leaderShipPosition: leaderShipPosition,
          bio: bio,
          maritalStatus: maritalStatus,
        image:imageUpload?.secure_url,

       },
        { new: true }
      );

      

      res
        .status(HttpCode.SUCCESSFUL)
        .json({ message: "Updated Successfully", data: updateCellData });
    } catch (err) {
      res?.status(HttpCode.UNPROCESSIBLE_IDENTITY).json({ message: err });
    }
  }
);

// get all cells

export const getAllCells = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const allCells = await CellModel.find();

    res.status(HttpCode.OK).json({ message: "All Cells", data: allCells });
  }
);

// get cells for one admin

export const getAllCellsForOneAdmin = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req?.admin?._id;
    const allCells = await CellModel.find({ cellAdminId: userId });

    res.status(HttpCode.OK).json({ message: "All Cells", data: allCells });
  }
);

// get current cell user
export const currentCellUser = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req?.cell?._id;

      console.log(userId);
      const currentCell = await CellModel.findById(userId);

      console.log(currentCell);

      res.status(HttpCode.OK).json({ message: "Me", data: currentCell });
    } catch (error) {
      res?.status(HttpCode.UNPROCESSIBLE_IDENTITY).json({ message: error });
    }
  }

);

// get a single cell user
export const oneCellUser = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id

      const currentCell = await CellModel.findById(userId);

      console.log(currentCell);

      res.status(HttpCode.OK).json({ message: "One Cell User", data: currentCell });
    } catch (error) {
      res?.status(HttpCode.UNPROCESSIBLE_IDENTITY).json({ message: error });
    }
  }
);

// get a single admin user
export const oneAdminUser = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id

      const oneAdminUser = await AdminModel.findById(userId);

      console.log(oneAdminUser);

      res.status(HttpCode.OK).json({ message: "One admin User", data: oneAdminUser });
    } catch (error) {
      res?.status(HttpCode.UNPROCESSIBLE_IDENTITY).json({ message: error });
    }
  }
);

// suspend cell
export const suspendACell = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;

      const currentCell = await CellModel.findByIdAndUpdate(
        id,
        { isSuspended: true },
        { new: true }
      );

      console.log(currentCell);

      res.status(HttpCode.OK).json({ message: "Me", data: currentCell });
    } catch (error) {
      res?.status(HttpCode.UNPROCESSIBLE_IDENTITY).json({ message: error });
    }
  }
);
// unsuspend a cell
export const unSuspendACell = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;

      const currentCell = await CellModel.findByIdAndUpdate(
        id,
        { isSuspended: false },
        { new: true }
      );

      console.log(currentCell);

      res.status(HttpCode.OK).json({ message: "Me", data: currentCell });
    } catch (error) {
      res?.status(HttpCode.UNPROCESSIBLE_IDENTITY).json({ message: error });
    }
  }
);
