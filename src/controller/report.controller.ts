import { AllAdminReports, AllCellReports, AllReports, GetOneSignleReport, MakeReport } from "../services/report.service";
import { NextFunction, Request, RequestHandler, Response } from "express";

export const WeeklyReport : RequestHandler = (req: Request, res: Response, next: NextFunction) => MakeReport(req,res,next)

export const AllReportOnServerForSuperAdmin : RequestHandler = (req: Request, res: Response, next: NextFunction) => AllReports(req,res,next)

export const reportsForOneCell : RequestHandler = (req: Request, res: Response, next: NextFunction) => AllCellReports(req,res,next)

export const reportsForOneAdmin : RequestHandler = (req: Request, res: Response, next: NextFunction) => AllAdminReports(req,res,next)

export const oneReport : RequestHandler = (req: Request, res: Response, next: NextFunction) => GetOneSignleReport(req,res,next)
