import {Router} from "express"
import { checkAdminUser,checkCellUser } from "../utils/checkUser"
// import { weeklyReport } from "../controller/report.controller"
import { AllAdmins, cellsUnderOneChurch, currentAdmin } from "../controller/admin.controller"
import { suspendACellEndpoint, unSuspendACellEndpoint } from "../controller/user.controller"

const adminRouter = Router()
// adminRouter.get("/report",checkAdminUser, weeklyReport)

adminRouter.get("/admins",checkAdminUser, AllAdmins)
adminRouter.get("/me",checkAdminUser, currentAdmin)
adminRouter.get("/cells/:id",checkAdminUser, cellsUnderOneChurch)
adminRouter.post("/cell/suspend/:id",checkAdminUser, suspendACellEndpoint)
adminRouter.post("/cell/suspend/:id",checkAdminUser, unSuspendACellEndpoint)


export default adminRouter