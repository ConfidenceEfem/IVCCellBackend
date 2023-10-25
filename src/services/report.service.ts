import { ReportModel } from "../model/report.model";
import { IReport } from "../interface/report.interface";
import { AsyncHandler } from "../utils/AsyncHandler";
import { NextFunction, Request, Response } from "express";
import { AppError, HttpCode } from "../utils/AppError";
import mongoose from "mongoose";
import { AdminModel } from "../model/admin.model";
import { CellModel } from "../model/cell.model";

// get all reports
export const MakeReport = AsyncHandler(async (req: Request, res: Response, next: NextFunction)=>{
    const {review,attendanceDetails,totalAttendance,topicDiscussed,date,newMembers,numberOfPeopleWhoacceptedSalvation} = req.body

    console.log(req?.cell?._id)

    const findAdmin = await AdminModel.findById(req?.cell?.cellAdminId)

    const findCell = await CellModel.findById(req?.cell?._id)


    const createReport = new ReportModel({
        review,attendanceDetails,totalAttendance,topicDiscussed,date,newMembers,numberOfPeopleWhoacceptedSalvation
    })
   
    createReport.cellAdminId = findAdmin
     createReport.cellId = findCell

   

 
 await findCell?.cellReport?.push(new mongoose.Types.ObjectId(createReport?._id))

  await findCell?.save()

  await createReport.save()

 


  res.status(HttpCode.SUCCESSFUL).json({message: "Report created successfully", data: createReport})

})

// get all reports
export const AllReports = AsyncHandler(async (req: Request<{},{},IReport>, res: Response, next: NextFunction)=>{
   

   const allReports = await ReportModel.find().sort({_id: -1})
   
   if(! req?.admin?.isSuperAdmin)  next(new AppError({message: "You don't have right for this operation", httpCode: HttpCode.BAD_REQUEST}))


  res.status(HttpCode.SUCCESSFUL).json({message: "Report successfully gotten", data: allReports})

})

// get only cell report 

export const AllCellReports = AsyncHandler(async (req: Request<{},{},IReport>, res: Response, next: NextFunction)=>{
   
  const userId = req?.cell?._id

  const allReports = await ReportModel.find({cellId: userId}).sort({_id: -1})
  


 res.status(HttpCode.SUCCESSFUL).json({message: "All report gotten successfully", data: allReports})

})

// Get report for one admin

export const AllAdminReports = AsyncHandler(async (req: Request<{},{},IReport>, res: Response, next: NextFunction)=>{
   
  const userId = req?.admin?._id

  const allReports = await ReportModel.find({cellAdminId: userId})
  
 res.status(HttpCode.SUCCESSFUL).json({message: "All Reports", data: allReports})

})


// Get one report

export const GetOneSignleReport = AsyncHandler(async (req: Request, res: Response, next: NextFunction)=>{
   
  const reportId = req.params.id

  const OneReport = await ReportModel.findById(reportId)
  
 res.status(HttpCode.SUCCESSFUL).json({message: "One Reports", data: OneReport})

})




