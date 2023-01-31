import { Timestamp } from "@google-cloud/firestore"
import {atom} from "recoil"

export interface Community{
    id:string,
    creatorId:string
    numberOfmembers:number,
    privacyType:"public"|"restricted"|"private",
    imageURl?:string    //optional
    createdAt?:Timestamp //optional
}