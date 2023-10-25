import {Document} from "mongoose"

export interface Icell extends Document{
    name: string,
    image: string,
    cellLeaderName: string,
    cellEmail: string,
    cellPassword: string,
    isEmailVerified: boolean,
    isFirstTimeLogin: boolean,
    cellAdminId: any,
    isSuspended: boolean,
    cellReport: any[],
    cellQuestions: any[]
    

}