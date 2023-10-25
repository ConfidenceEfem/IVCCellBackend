import {Router} from "express"
import { checkAdminUser,checkCellUser } from "../utils/checkUser"
import { AllReportOnServerForSuperAdmin, oneReport, reportsForOneAdmin, reportsForOneCell, WeeklyReport } from "../controller/report.controller"

const reportRouter = Router()
reportRouter.post("/weekly-reports", checkCellUser, WeeklyReport)
reportRouter.get("/reports", checkCellUser, reportsForOneCell)
reportRouter.get("/church/all-reports", checkAdminUser, AllReportOnServerForSuperAdmin)
reportRouter.get("/church/reports", checkAdminUser, reportsForOneAdmin)
reportRouter.get("/church/reports/:id", checkCellUser, oneReport)


export default reportRouter