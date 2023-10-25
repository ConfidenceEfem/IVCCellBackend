import { IReply } from "@src/interface/reply.interface"
import {Schema, model} from "mongoose"

const RepliesSchema = new Schema<IReply>({
    replyText: {type: String, required: true},
    userId: {type: Schema.Types.ObjectId, ref: "admin"},
    questionId: {type: Schema.Types.ObjectId, ref: "question"},
}, {
    timestamps: true
})

export const ReplyModel = model("reply", RepliesSchema)