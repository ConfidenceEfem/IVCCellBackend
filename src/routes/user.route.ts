import { newCellRegistration,newAdminRegistration, verifyAdminEmail,resendOtpForEmailVerification, resetCellPassword, signInACell, verifyCellEmail, signInAnAdmin, AllCellsForOneChurch, AllCells, resetAdminPassword, updateDataForCell, CellUserProfile, GetAdminById, GetCellById } from "../controller/user.controller"
import {Router} from "express"
import { checkAdminUser,checkCellUser } from "../utils/checkUser"
import { WeeklyReport } from "../controller/report.controller"
import uploader from "../config/multer"

const userRouter = Router()
userRouter.post("/register-cell",checkAdminUser, newCellRegistration)
userRouter.post("/register-admin",
checkAdminUser, 
newAdminRegistration)
userRouter.post("/login-cell", signInACell)
userRouter.post("/login-admin", signInAnAdmin)
userRouter.post("/verify-cellemail", verifyCellEmail)
userRouter.post("/verify-adminemail", verifyAdminEmail)
userRouter.post("/resend-otp", resendOtpForEmailVerification)
userRouter.post("/reset-cellpassword",checkCellUser, resetCellPassword)
userRouter.post("/update",checkCellUser,uploader, updateDataForCell)
userRouter.post("/reset-adminpassword",checkAdminUser, resetAdminPassword)
// userRouter.post("/weekly-reports",checkCellUser, WeeklyReport)
userRouter.get("/church/cells",checkAdminUser, AllCellsForOneChurch)
userRouter.get("/cells",checkAdminUser, AllCells)
userRouter.get("/me", checkCellUser, CellUserProfile)
userRouter.get("/admin/:id",  GetAdminById)
userRouter.get("/cell/:id", GetCellById)

export default userRouter