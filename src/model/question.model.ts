import { IQuestion } from "@src/interface/question.interface"
import mongoose, { Schema, model } from "mongoose"

const QuestionSchema = new Schema<IQuestion>({
    cellAdminId: {
        type: Schema.Types.ObjectId,
        ref: "admin"
    },
    cellId: {
        type: Schema.Types.ObjectId,
        ref: "cell"
    },
    text: {type: String, required: true},
    replies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "reply"
        }
    ]
}, {
    timestamps: true
})

export const QuestionModel = model("question", QuestionSchema)