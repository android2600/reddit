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

export interface CommunitySnippet{
    communityId:string;
    isModerator?: boolean;
    imageURL?:string
}

interface CommunityState{
    mySnippets: CommunitySnippet []
    //visitedCommunities
}
export const defaultCommunityState:CommunityState={
    mySnippets:[]
}
export const communityState=atom<CommunityState>({
    key:"communitiesState",
    default:defaultCommunityState
})