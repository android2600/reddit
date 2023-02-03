import { collection, deleteDoc, doc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { authModalState } from '../atoms/authModalAtom';
import { communityState } from '../atoms/communitiesAtom';
import { Post, postState, PostVote } from '../atoms/postAtom';
import {auth, firestore, storage } from '../firebase/clientApp';

const usePosts = () => {
    const [postStateValue,setPostStateValue]=useRecoilState(postState)
    const [user]=useAuthState(auth) 
    const currentCommunity=useRecoilValue(communityState).currentCommunity
    const setAuthModalState=useSetRecoilState(authModalState) 
    const router=useRouter()
    //check for a user=>if not open auth modal    
    
    const onVote=async (event:React.MouseEvent<SVGElement,MouseEvent>,
        post:Post,vote:number,communityId:string)=>{
            event.stopPropagation()//stopping the propagation of click event to child
        if(!user?.uid){
        setAuthModalState({open:true,view:"login"})
        return
    }
    
        try {
            const {voteStatus}=post
            const existingVote=postStateValue.postVotes.find(
                (vote)=>vote.postId===post.id)
            //copying the state modifying the copy and updating the state
            const batch=writeBatch(firestore)
            const updatedPost={...post}
            const updatedPosts=[...postStateValue.posts]
            let updatedPostVotes=[...postStateValue.postVotes]
            let voteChange=vote
            
            if(!existingVote){
                //add/substract 1 to/from post.voteStatus
                //create a new postVote document

                const postVoteRef=doc(collection(firestore,"user",`${user?.uid}/postVotes`))
                const newVote: PostVote={
                    id:postVoteRef.id,
                    postId:post.id!,
                    communityId,
                    voteValue:vote
                }
                batch.set(postVoteRef,newVote)
                updatedPost.voteStatus=voteStatus+vote
                updatedPostVotes=[...updatedPostVotes,newVote]
            }
            else{

                const postVoteRef=doc(firestore,"user",`${user?.uid}/postVotes/${existingVote.id}`)
                //Removing Vote 
                if(existingVote.voteValue===vote){
                    //add/substract 1 to/from post.voteStatus
                    updatedPost.voteStatus=voteStatus-vote
                    updatedPostVotes=updatedPostVotes.filter(vote=>vote.id!== existingVote.id)
                    //delete a new postVote document
                    batch.delete(postVoteRef)
                    voteChange*=-1
                }
                //Flipping the Vote
                else{
                    //add/substract 2 to/from post.voteStatus
                    updatedPost.voteStatus=voteStatus+2*vote
                    //finding index
                    const voteIdx=postStateValue.postVotes.findIndex((vote)=>
                    vote.id===existingVote.id)

                    updatedPostVotes[voteIdx]={
                        ...existingVote,
                        voteValue:vote
                    }

                    //updating a new postVote document
                    batch.update(postVoteRef,{
                        voteValue:vote
                    })
                    voteChange=2*vote
                }
            }
            const postIdx=postStateValue.posts.findIndex((item)=>item.id===post.id)
            updatedPosts[postIdx]=updatedPost
            //update state with updated value
            setPostStateValue((prev)=>({
                ...prev,
                posts:updatedPosts,
                postVotes:updatedPostVotes,

            }))
            if (postStateValue.selectedPost){
                setPostStateValue(prev=>({
                    ...prev,
                    selectedPost:updatedPost
                }))
            }
            const postRef= doc(firestore,"posts",post.id!)
            batch.update(postRef,{voteStatus:voteStatus + voteChange})
            await batch.commit()
        } catch (error:any) {
            console.log("onVote error",error)
        }
    }

    const onSelectPost=(post:Post)=>{
        setPostStateValue(prev=>({
            ...prev,
            selectedPost:post
        }))
        router.push(`/r/${post.communityId}/comments/${post.id}`)
    }

    const onDeletePost=async(post: Post): Promise<boolean>=>{
        try {
            //check if image, delete if exists
            if(post.imageURL){
                const imageRef=ref(storage,`posts/${post.id}/image`)
                await deleteObject(imageRef)
            }
            //delete post document from firestore
            const postDocRef=doc(firestore,"posts",post.id!)
            await deleteDoc(postDocRef)
            //update recoil state
            setPostStateValue(prev=>({
                ...prev,
                posts: prev.posts.filter(item=>item.id!==post.id)
            }))
        } catch (error) {
            
        }
        return true
    }
    
    const getCommunityPostVote=async(communityId:string)=>{
        const postVotesQuery=query(collection(firestore,"user",`${user?.uid}/postVotes`),
        where("communityId","==",communityId))
        
        const postVoteDocs=await getDocs(postVotesQuery)
        const postVotes=postVoteDocs.docs.map((doc)=>({
            id:doc.id,
            ...doc.data()
        }))
        setPostStateValue((prev)=>({
            ...prev,
            postVotes:postVotes as PostVote[]
        }))
    }

    useEffect(()=>{
        if(!user||!currentCommunity?.id) return
        getCommunityPostVote(currentCommunity?.id)
    },[user,currentCommunity])
    
    useEffect(()=>{
        if(!user){
            setPostStateValue((prev)=>({
                ...prev,
                postVotes:[]
            }))
        }}
    ,[user])

    return {
        postStateValue,
        setPostStateValue,
        onVote,
        onDeletePost,
        onSelectPost
    }
}
export default usePosts;