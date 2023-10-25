import {Document} from "mongoose"

export interface IReport extends Document{
date: Date,
totalAttendance: number,
newMembers: number,
numberOfPeopleWhoacceptedSalvation: number
review: string,
topicDiscussed: string,
cellId: any,
cellAdminId: any
attendanceDetails:any
}