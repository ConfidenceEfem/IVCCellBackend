import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler";
import { IQuestion } from "../interface/question.interface";
import { CellModel } from "../model/cell.model";
import { QuestionModel } from "../model/question.model";
import { AppError, HttpCode } from "../utils/AppError";
import { AdminModel } from "../model/admin.model";

// cells being able to ask questions for difficulties
export const AskQuestion = AsyncHandler(async (req: Request<{},{}, IQuestion>, res: Response, next: NextFunction) => {
   try{
    const {text } = req.body



    const findCell = await CellModel.findById(req?.cell?._id)
    

    const findAdmin = await AdminModel.findById(findCell?.cellAdminId)


    const createQuestion = new QuestionModel({
        text: text
    })

     createQuestion.cellId = findCell

     createQuestion.cellAdminId = findAdmin

     createQuestion.save()

     return res.status(HttpCode.SUCCESSFUL).json({message: "Question asked", data: createQuestion})
   }catch(error){
    res?.status(HttpCode.UNPROCESSIBLE_IDENTITY).send(error)
   }
})

// getting all questions asked by a particular cell
export const getOneQuestion = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const questionId = req.params.id

    const findQuestion = await QuestionModel.findById(questionId).populate("replies").populate("cellId")

    return res.status(HttpCode.OK).json({message: "Question", data: findQuestion})
})

// get question asked by a user
export const findAllQuestionForOneCell = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
   try{

const id = req?.cell?._id

const allMyQuestion = await QuestionModel.find({cellId: id}).populate("cellId").populate("cellAdminId")

    res?.status(HttpCode.OK).json({message: "My Questions", data: allMyQuestion})
   }catch(err){
    res?.status(HttpCode.UNPROCESSIBLE_IDENTITY).json({message: err})
   }
})

// get question asked by a user
export const getAllQuestions = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
   try{

    if(!req?.admin?.isAdmin){
        next(new AppError({message: "You don't have right ot perform this operation", httpCode: HttpCode.BAD_REQUEST}))
    }

const allMyQuestion = await QuestionModel.find().populate("cellId").populate("cellAdminId").sort({_id: -1})

    res?.status(HttpCode.OK).json({message: "All Questions", data: allMyQuestion})
   }catch(err){
    res?.status(HttpCode.UNPROCESSIBLE_IDENTITY).json({message: err})
   }
})

// delete one question
export const deleteQuestion = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
   try {
    const findQuestion = await QuestionModel.findByIdAndDelete(req.params.id)

    return res.status(HttpCode.OK).json({message: "Question deleted successfully", data: findQuestion})
   } catch (error) {
    res.status(HttpCode.UNPROCESSIBLE_IDENTITY).json({message: error})
   }
})

