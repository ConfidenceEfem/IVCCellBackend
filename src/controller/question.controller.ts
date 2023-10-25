import { AskQuestion, deleteQuestion, findAllQuestionForOneCell, getAllQuestions, getOneQuestion } from "../services/question.service";
import {NextFunction, Request, RequestHandler, Response} from "express"


export const AskQuestionEndPoint : RequestHandler = (req: Request, res: Response, next: NextFunction) => AskQuestion(req,res, next)

export const GetOneQuestionEndPoint : RequestHandler = (req: Request, res: Response, next: NextFunction) => getOneQuestion(req,res,next)

export const findAllQuestionForOneCellEndPoint : RequestHandler = (req: Request, res: Response, next: NextFunction) => findAllQuestionForOneCell(req,res,next)

export const getAllQuestionEndPoint : RequestHandler = (req: Request, res: Response, next: NextFunction) => getAllQuestions(req,res,next)

export const deleteQuestionEndPoint : RequestHandler = (req: Request, res: Response, next: NextFunction) => deleteQuestion(req,res,next)

