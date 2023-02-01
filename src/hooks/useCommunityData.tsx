//Custom Hook
import { collection, doc, getDocs, increment, query, writeBatch } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { authModalState } from '../atoms/authModalAtom';
import { Community, CommunitySnippet, communityState } from '../atoms/communitiesAtom';
import { auth, firestore } from '../firebase/clientApp';

const useCommunityData = () => {
    const [user]=useAuthState(auth)
    const [communityStateValue,setCommunityStateValue]= 
    useRecoilState(communityState)
    
    const setAuthModalState=useSetRecoilState(authModalState)
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState("")
    
    const onJoinOrLeaveCommunity= (
        communityData:Community,
        isJoined:boolean
        ) => {
        //is the user signed in?
        if(!user){
            //opens modal
            setAuthModalState({open:true,view:"login"})
            return
        }
        //if not then open auth modal
        if(isJoined) {
            leaveCommunity(communityData.id)
            return
        }
        joinCommunity(communityData)
    }

    const getMySnipets=async()=>{
        setLoading(true)
        try {
            const snippetDocs=await getDocs(query(
                collection(firestore, `user/${user?.uid}/communitySnippets`)
              )) //Use query statement for firebase
            const snippets=snippetDocs.docs.map((doc) => ({ ...doc.data() }))
            //console.log("here are my snippets",snippets)
            setCommunityStateValue((prev)=>({
                ...prev,
                mySnippets: snippets as CommunitySnippet[]
            }))

        } catch (error:any) {
            console.log("getMySnippets error",error)
            setError(error.message)
        }
        setLoading(false)
    }
    const joinCommunity=async (communityData:Community)=>{
        //batch write
            //creating a new community snippet
            //updating the number of members of the community (+1)
        setLoading(true)
        try {
            const batch=writeBatch(firestore)
            const newSnippet: CommunitySnippet={
                communityId:communityData.id,
                imageURL:communityData.imageURl || "",
            }
            batch.set(doc(
                firestore,
                `user/${user?.uid}/communitySnippets`,
                communityData.id
            ),newSnippet
            )
            batch.update(doc(firestore,"communities",communityData.id),{
                numberOfMembers:increment(1),
            })
            await batch.commit()
            // update recoil state- communitySatate.mySnippets
            setCommunityStateValue(prev=>({
                ...prev,
                mySnippets:[...prev.mySnippets,newSnippet],
            }))

        } catch (error:any) {
            console.log("joinCommunity error",error)
            setError(error.message)
        }
        setLoading(false)
    }
    const leaveCommunity= async (communityId:string)=>{
         //batch write
            //deleting a new community snippet
            //updating the number of members of the community (-1)    
        setLoading(true)    
        try {
        const batch=writeBatch(firestore)
        batch.delete((doc(firestore,`user/${user?.uid}/communitySnippets`,communityId)))
        batch.update(doc(firestore,"communities",communityId),{
            numberOfMembers:increment(-1)
        })
        await batch.commit()

        // update recoil state- communitySatate.mySnippets
        setCommunityStateValue(prev=>({
            ...prev,
            mySnippets:prev.mySnippets.filter((item)=>item.communityId!==communityId),
        }))
    } catch (error:any) {
        console.log("leaveCommunity error",error)
        setError(error.message)
    }
    setLoading(false)
    }

    useEffect(()=>{
        if(!user) return
        getMySnipets()
    },[user])
    
    return { //keep return bracket on the same line
            //returns object= data and functions
            communityStateValue,
            onJoinOrLeaveCommunity,
            loading
        }
}

export default useCommunityData;


