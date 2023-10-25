import { IReport } from "../interface/report.interface"
import {Schema,model} from "mongoose"

const reportSchema= new Schema<IReport>({
    date: {type:Date, required: true},
    totalAttendance:{type: Number, required: true},
    newMembers: {type: Number, required: true},
    numberOfPeopleWhoacceptedSalvation: {type: Number, required: true},
    review: {type: String, required: true},
    topicDiscussed: {type: String, required: true},
    
    attendanceDetails: {type: Array, required: true},
   
    cellAdminId: {
        type: Schema.Types.ObjectId,
        ref: "admin"
    },
    cellId: {
        type: Schema.Types.ObjectId,
        ref: "cell"
    }
   
   
    
}, {
    timestamps: true
})

export const ReportModel  =  model("reports", reportSchema)