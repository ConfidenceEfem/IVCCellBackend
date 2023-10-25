import express, { Application, NextFunction, Request, Response } from "express"
import { ErrorHandler } from "./middlewares/error"
import router from "./api"
import cors from "cors"

export const appConfig = (app: Application) => {
    app
    .use(express.json())
    .use(cors())
    .get("/", (req: Request, res: Response,next: NextFunction) => {
        res.send("Welcome to my page")
    })
    .use("/api", router)
    .all("*", (req: Request, res: Response)=> {
        res.status(404).json({message: "This route is not found", data: req.originalUrl})
    })
    .use(ErrorHandler)

    
}