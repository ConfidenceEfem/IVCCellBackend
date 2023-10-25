import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "./AsyncHandler";
import jwt from "jsonwebtoken"
import { HttpCode } from "./AppError";
import { environmentalVariables } from "../config/EnvironmentalVariables";
import { Icell } from "../interface/cell.interface";
import { Iadmin } from "@src/interface/admin.interface";

interface TokenPayloadForCell {
    _id: string;
    name: string,
    cellEmail: string,
    cellPassword: string,
    cellLeaderName: string,
    isEmailVerified: boolean,
    isFirstTimeLogin: boolean,
    isSuperAdmin: boolean,
    isAdmin: boolean,
    image: string,

  }
  
interface TokenPayloadForAdmin {
    _id: string;
    name: string,
    cellEmail: string,
    cellPassword: string,
    cellLeaderName: string,
    isEmailVerified: boolean,
    isFirstTimeLogin: boolean,
    isSuperAdmin: boolean,
    isAdmin: boolean,
    image: string,

  }
  
  declare global {
    namespace Express {
      interface Request {
        cell?: TokenPayloadForCell;
      }
    }
  }

  declare global {
    namespace Express {
      interface Request {
        admin?: TokenPayloadForAdmin;
      }
    }
  }


export const checkCellUser = AsyncHandler(async (req:Request, res: Response, next: NextFunction)=> {
    const getToken = req.headers.authorization
    if(!getToken){
        res.status(HttpCode.BAD_REQUEST).send("No token")
    }else{
        const getJwtToken : string =  getToken?.split(" ")[1]
        if(!getJwtToken){
            res.status(HttpCode.BAD_REQUEST).send("Check token")
        }else{
            jwt.verify(getJwtToken, environmentalVariables.JWT_SECRET_KEY as string, (err, payload)=>{
                if (err) {
                    res.status(403).json({message: err.message, err: err});
                    return;
                  }
              
                  req.cell  = payload as Icell
                  next();
            })
        }
    }
    
   })

export const checkAdminUser = AsyncHandler(async (req:Request, res: Response, next: NextFunction)=> {
    const getToken = req.headers.authorization
    if(!getToken){
        res.status(HttpCode.BAD_REQUEST).send("No token")
    }else{
        const getJwtToken : string =  getToken?.split(" ")[1]
        if(!getJwtToken){
            res.status(HttpCode.BAD_REQUEST).send("Check token")
        }else{
            jwt.verify(getJwtToken, environmentalVariables.JWT_SECRET_KEY as string, (err, payload)=>{
                if (err) {
                    res.status(403).json({message: err.message, err: err});
                    return;
                  }
              
                  req.admin  = payload as Iadmin
                  next();
            })
        }
    }
    
   })