import { checkAdminUser } from "../utils/checkUser"
import { ReplyQuestionEndPoint } from "../controller/reply.controller"
import {Router} from "express"

const ReplyRouter = Router()

ReplyRouter.post("/question/:id",checkAdminUser, ReplyQuestionEndPoint)

export default ReplyRouter