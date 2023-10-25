import {Document} from "mongoose"

export interface IReply extends Document {
    replyText: string,
    userId : any,
    questionId: any
}