import { Iadmin } from "../interface/admin.interface"
import {Schema,model} from "mongoose"

const adminSchema= new Schema<Iadmin>({
    name: {type:String, required: true},
    
    isFirstTimeLogin:{type: Boolean,default:true},
    adminEmail: {type: String, required: true},
    adminPassword: {type: String},
    image: {type: String,default:""},
    adminFullName: {type: String,default:""},
    bio: {type: String,default:""},
    maritalStatus: {type: String,default:""},
    leaderShipPosition: {type: String,default:""},
    isEmailVerified: {type: Boolean, default: false},
    isAdmin: {type: Boolean, default: true},
    isSuperAdmin: {type: Boolean, default: false},
    cells: [
        {
            type: Schema.Types.ObjectId,
            ref: "cell"
        }
    ]
    
}, {
    timestamps: true
})

export const AdminModel =  model("admin", adminSchema)