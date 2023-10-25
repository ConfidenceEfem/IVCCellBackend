import mongoose from "mongoose";
import { environmentalVariables } from "./EnvironmentalVariables";



export const connnectMongodb = () => {
  const url = environmentalVariables.MONGOOSE_URL

  const connectDb = mongoose.connect(url as string).then((db)=>{
      console.log("Connected to db", db.connection.host)
  }).catch((err)=>{
      console.log("mongodb error", err)
  })


  return connectDb

 
  

}

