import { checkAdminUser, checkCellUser } from "../utils/checkUser"
import { AskQuestionEndPoint, GetOneQuestionEndPoint, deleteQuestionEndPoint, findAllQuestionForOneCellEndPoint, getAllQuestionEndPoint } from "../controller/question.controller"
import { Router } from "express"

const questionRouter = Router()

questionRouter.post("/question",checkCellUser, AskQuestionEndPoint)

questionRouter.get("/question/:id", GetOneQuestionEndPoint)

questionRouter.get("/all",checkAdminUser, getAllQuestionEndPoint)

questionRouter.post("/delete/:id", deleteQuestionEndPoint)

questionRouter.get("/me", checkCellUser,findAllQuestionForOneCellEndPoint)

export default questionRouter