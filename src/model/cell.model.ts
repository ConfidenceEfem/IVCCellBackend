import { Icell } from "../interface/cell.interface";
import { Schema, model } from "mongoose";

const cellSchema = new Schema<Icell>(
  {
    name: { type: String, required: true },
    isFirstTimeLogin: { type: Boolean, default: true },
    cellEmail: { type: String, required: true },
    image: {
      type: String,
      default:""
    },
   
    maritalStatus: {
      type: String,
      default:""
    },
    bio: {
      type: String,
      default:""
    },
    cellAdminId: {
      type: Schema.Types.ObjectId,
      ref: "admin",
    },
    cellPassword: { type: String },
    cellLeaderName: { type: String,default:"" },
    isEmailVerified: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
    cellReport: [
      {
        type: Schema.Types.ObjectId,
        ref: "reports",
      },
    ],
    cellQuestions: [
      {
        type: Schema.Types.ObjectId,
        ref: "question",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const CellModel = model("cell", cellSchema);
