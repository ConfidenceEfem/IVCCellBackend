import { AppError, HttpCode } from "../utils/AppError"
import { AsyncHandler } from "../utils/AsyncHandler"
import { AdminModel } from "../model/admin.model"
import { NextFunction, Request, Response } from "express"

export const getAllAdmin = AsyncHandler(async (req: Request, res: Response, next: NextFunction)=>{
  
    if(!req?.admin?.isSuperAdmin)  next(new AppError({message: "You don't have right for this operation", httpCode: HttpCode.BAD_REQUEST}))

    const allCells = await AdminModel.find()

    

    res.status(HttpCode.OK).json({message: "All Church", data: allCells})
})

// get current cell user
export const currentAdminUser = AsyncHandler(async (req: Request, res: Response, next: NextFunction)=>{
    try {
     const userId = req?.admin?._id
     const currentAdmin = await AdminModel.findById(userId)
 
     res.status(HttpCode.OK).json({message: "Me", data: currentAdmin})
    } catch (error) {
     res?.status(HttpCode.UNPROCESSIBLE_IDENTITY).json({message: error})
    }
 })
 

// get current cell user
export const getAllCellsForUnderOneChurch = AsyncHandler(async (req: Request, res: Response, next: NextFunction)=>{
    try {
     const userId = req.params.id
     const allAdminCells = await AdminModel.findById(userId).populate("cells")
 
     res.status(HttpCode.OK).json({message: "My Cells", data: allAdminCells})
    } catch (error) {
     res?.status(HttpCode.UNPROCESSIBLE_IDENTITY).json({message: error})
    }
 })
 
 
 