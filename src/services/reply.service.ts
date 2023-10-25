import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler";
import { QuestionModel } from "../model/question.model";
import { AppError, HttpCode } from "../utils/AppError";
import { ReplyModel } from "../model/reply.model";
import mongoose from "mongoose";
import { AdminModel } from "../model/admin.model";

// reply question end point meant only for admin
export const ReplyQuestion = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {

  try {
    console.log(req?.admin?._id)
   
    const findAmdin = await AdminModel.findById(req?.admin?._id)

    if(!findAmdin) next(new AppError({message: "You don't have right to perform this operation", httpCode: HttpCode.BAD_REQUEST}))

    const getQuestion = await QuestionModel.findById(req.params.id)

    const replyQuestion = new ReplyModel({
        replyText: req.body.replyText
    })

    replyQuestion.questionId = getQuestion
    replyQuestion.userId = findAmdin

    replyQuestion.save()

    getQuestion?.replies.push(new mongoose.Types.ObjectId(replyQuestion._id))

    getQuestion?.save()

    res?.status(HttpCode.SUCCESSFUL).json({message: "replid done", data: replyQuestion})

  } catch (error) {
    res.status(HttpCode.UNPROCESSIBLE_IDENTITY).json({message: error})
  }

})