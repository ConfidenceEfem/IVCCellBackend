import { registerANewCell, loginACell,registerAnAdmin,resendVerificationEmailOtp, resetPassword, loginAnAdmin, verifyEmailForCell, verifyEmailForAdmin, getAllCellsForOneAdmin, getAllCells, resetPasswordForAdmin, updateCellData, currentCellUser } from "../services/user.services"
import {NextFunction, Request, RequestHandler, Response} from "express"

export const newCellRegistration : RequestHandler = (req: Request, res: Response, next: NextFunction) => registerANewCell(req,res,next)

export const newAdminRegistration : RequestHandler = (req: Request, res: Response, next: NextFunction) => registerAnAdmin(req,res,next)

export const signInAnAdmin : RequestHandler = (req: Request, res: Response, next: NextFunction) => loginAnAdmin(req,res,next)

export const signInACell : RequestHandler = (req: Request, res: Response, next: NextFunction) => loginACell(req,res,next)

export const verifyCellEmail : RequestHandler = (req: Request, res: Response, next: NextFunction) => verifyEmailForCell(req,res,next)

export const verifyAdminEmail : RequestHandler = (req: Request, res: Response, next: NextFunction) => verifyEmailForAdmin(req,res,next)
 
export const resendOtpForEmailVerification : RequestHandler = (req: Request, res: Response, next: NextFunction) => resendVerificationEmailOtp(req,res,next)

export const resetCellPassword : RequestHandler = (req: Request, res: Response, next: NextFunction) => resetPassword(req,res,next)

export const resetAdminPassword : RequestHandler = (req: Request, res: Response, next: NextFunction) => resetPasswordForAdmin(req,res,next)

export const updateDataForCell : RequestHandler = (req: Request, res: Response, next: NextFunction) => updateCellData(req,res,next)

export const AllCells : RequestHandler = (req: Request, res: Response, next: NextFunction) => getAllCells(req,res,next)

export const AllCellsForOneChurch : RequestHandler = (req: Request, res: Response, next: NextFunction) => getAllCellsForOneAdmin(req,res,next)

export const CellUserProfile : RequestHandler = (req: Request, res: Response, next: NextFunction) => currentCellUser(req,res,next)

export const suspendACellEndpoint: RequestHandler = (req: Request, res: Response, next: NextFunction) => currentCellUser(req,res,next)

export const unSuspendACellEndpoint : RequestHandler = (req: Request, res: Response, next: NextFunction) => currentCellUser(req,res,next)

