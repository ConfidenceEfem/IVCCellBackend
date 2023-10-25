import express, { Application } from "express"
import { appConfig } from "./server"
import { environmentalVariables } from "./config/EnvironmentalVariables"
import { connnectMongodb } from "./config/db"

const app : Application = express()

appConfig(app)

connnectMongodb()

app.listen(environmentalVariables.PORT,()=>{
console.log("listening to port", environmentalVariables.PORT)
})