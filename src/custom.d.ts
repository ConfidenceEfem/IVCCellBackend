import {Response,Request} from "express"
import { Icell } from "./interface/cell.interface"
import { Iadmin } from "./interface/admin.interface"

declare module "express-serve-static-core" {
    interface Request {
        admin?: Iadmin,
        cell?: Icell
    }
}