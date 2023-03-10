import { Timestamp } from "@google-cloud/firestore"
import {atom} from "recoil"

export interface Community{
    id:string,
    creatorId:string
    numberOfMembers:number,
    privacyType:"public"|"restricted"|"private",
    imageURl?:string    //optional
    createdAt:Timestamp 
}

export interface CommunitySnippet{
    communityId:string;
    isModerator?: boolean;
    imageURL?:string
}

interface CommunityState{
    mySnippets: CommunitySnippet []
    currentCommunity?: Community
    snippetsFetched:boolean
}
export const defaultCommunityState:CommunityState={
    mySnippets:[],
    snippetsFetched:false
}
export const communityState=atom<CommunityState>({
    key:"communitiesState",
    default:defaultCommunityState
})