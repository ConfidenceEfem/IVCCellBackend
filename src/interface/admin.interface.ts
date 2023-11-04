import {Document} from "mongoose"

export interface Iadmin extends Document{
    name: string,
    image: string,
    adminFullName: string,
    bio: string,
    maritalStatus: string,
    leaderShipPosition: string,
    isAdmin: boolean,
    isSuperAdmin: boolean,
    adminEmail: string,
    adminPassword: string,
    isEmailVerified: boolean,
    isFirstTimeLogin: boolean,
    cells?: any[],

}