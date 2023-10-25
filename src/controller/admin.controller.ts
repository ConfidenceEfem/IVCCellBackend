import { currentAdminUser, getAllAdmin, getAllCellsForUnderOneChurch } from "../services/admin.service";
import { NextFunction, Request, RequestHandler, Response } from "express";

export const AllAdmins : RequestHandler = (req: Request, res: Response, next: NextFunction) => getAllAdmin(req,res,next)

export const currentAdmin : RequestHandler = (req: Request, res: Response, next: NextFunction) => currentAdminUser(req,res,next)

export const cellsUnderOneChurch : RequestHandler = (req: Request, res: Response, next: NextFunction) => getAllCellsForUnderOneChurch(req,res,next)
