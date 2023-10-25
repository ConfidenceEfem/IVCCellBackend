import {Document} from "mongoose"

export  interface IQuestion extends Document {
    text: string,
    cellId: any,
    cellAdminId: any,
    replies: any[]
}