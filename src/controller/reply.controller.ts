import { ReplyQuestion } from "../services/reply.service";
import {NextFunction, Request, RequestHandler, Response} from "express"


export const ReplyQuestionEndPoint : RequestHandler = (req: Request, res: Response, next: NextFunction) => ReplyQuestion(req,res, next)


