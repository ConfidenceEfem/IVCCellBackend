import reportRouter from "../routes/report.route"
import adminRouter from "../routes/admin.route"
import userRouter from "../routes/user.route"
import {Router} from "express"
import questionRouter from "../routes/question.route"
import ReplyRouter from "../routes/reply.route"

const router = Router()

router.use("/auth", userRouter)
router.use("/cell", reportRouter)
router.use("/admin", adminRouter)
router.use("/question", questionRouter)
router.use("/reply", ReplyRouter)

export default router