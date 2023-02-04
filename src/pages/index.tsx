import { Stack } from "@chakra-ui/react";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Post } from "../atoms/postAtom";
import PageContent from "../components/Layout/PageContent";
import PostItem from "../components/Posts/PostItem";
import PostLoader from "../components/Posts/PostLoader";
import { auth, firestore } from "../firebase/clientApp";
import useCommunityData from "../hooks/useCommunityData";
import usePosts from "../hooks/usePosts";

export default function Home() {
  const [user,loadingUser]=useAuthState(auth)
  const [loading,setLoading]=useState(false)
  //const communityStateValue=useRecoilValue(communityState)
  const {onSelectPost,onDeletePost,onVote,postStateValue,setPostStateValue}=usePosts()
  
  const {communityStateValue}=useCommunityData()
  const buildNoUserHomeFeed=async()=>{
    setLoading(true)
    try { 
      const postQuery=query(
      collection(firestore,"posts"),
      orderBy("voteStatus","desc"),limit(10))

      const postDocs=await getDocs(postQuery)
      const posts=postDocs.docs.map((doc)=>({
        id:doc.id,...doc.data()
      }))
      setPostStateValue((prev)=>({
        ...prev,
        posts: posts as Post[],
      }))
    } catch (error) {
      console.log("buildNoUserHomeFeed error",error)
    }
    setLoading(false)
  }
  
  
  const buildUserHomeFeed=async()=>{
    setLoading(true)
    try {
      if (communityStateValue.mySnippets.length){
      const myCommunityIds=communityStateValue.mySnippets.map((snippet)=>snippet.communityId)
      const postQuery=query(collection(firestore,"posts"),
      where("communityId","in",myCommunityIds),limit(10))
      
      const postDocs=await getDocs(postQuery)
      const posts=postDocs.docs.map((doc)=>({
        id:doc.id,
        ...doc.data()
      }))
      setPostStateValue((prev)=>({
        ...prev,
        posts:posts as Post[]
      }))
      }
      else{
        buildNoUserHomeFeed()
      }
    } catch (error) {
      console.log("buildUserHomeFeed error",error)
    }
    setLoading(false)
  }
  const getUserPostVotes=()=>{}

  useEffect(()=>{
    if(!user && !loadingUser) buildNoUserHomeFeed()
  },[user,loadingUser])

  useEffect(()=>{
    if(communityStateValue.snippetsFetched) buildUserHomeFeed()
  },[communityStateValue.snippetsFetched])

  return (
    <PageContent>
      <>
      {loading?(<PostLoader/>):(
        <Stack>
          {postStateValue.posts.map((post)=>(
            <PostItem 
            key={post.id}
            post={post}
            onSelectPost={onSelectPost}
            onDeletePost={onDeletePost}
            onVote={onVote}
            userVoteValue={postStateValue.postVotes.find(
              (item)=>item.postId===post.id)?.voteValue}
            userIsCreator={user?.uid===post.creatorId}
            homePage
            />
          ))}
        </Stack>
      )}
      </>
      <></>
    </PageContent>
  )
}
