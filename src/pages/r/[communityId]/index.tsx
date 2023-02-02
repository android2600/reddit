import { doc, getDoc } from 'firebase/firestore';
import { GetServerSidePropsContext } from 'next';
import React, { useEffect } from 'react';
import { Community, communityState } from '../../../atoms/communitiesAtom';
import { firestore } from '../../../firebase/clientApp';
import safeJsonStringify from "safe-json-stringify"
import NotFound from '../../../components/Community/NotFound';
import Header from '../../../components/Community/Header';
import PageContent from '../../../components/Layout/PageContent';
import CreatePostLink from '../../../components/Community/CreatePostLink';
import Posts from '../../../components/Posts/Posts';
import { useRecoilState, useSetRecoilState } from 'recoil';
import About from '../../../components/Community/About';

type CommunityPageProps = {
    communityData: Community
};

const CommunityPage:React.FC<CommunityPageProps> = ({communityData}) => {
    const setCommunityStateValue=useSetRecoilState(communityState)
    if (!communityData){
        return <NotFound/> // leads to Not Found Community page
    }
    useEffect(()=>{
        setCommunityStateValue((prev)=>({
            ...prev,
            currentCommunity:communityData
        }))
    },[])

    return (
        <>
        <Header communityData={communityData}/>
        <PageContent>
            <>
            <CreatePostLink/>
            <Posts communityData={communityData}/>
            </> 
            <><About communityData={communityData}/></> 
        </PageContent>
        </>
    )
}


export async function getServerSideProps(context:GetServerSidePropsContext){ //Server side rendering
    //get community data and pass it to client component
    try {
        const communityDocRef= doc(
            firestore,
            "communities",
            context.query.communityId as string
            )
        const communityDoc=await getDoc(communityDocRef)
        
        return {
            props:{
                communityData: JSON.parse(
                    safeJsonStringify({id: communityDoc.id,...communityDoc.data()})) //Issue in NextJs when stringifying timestamp hence safe-json 
            }
        }
    } 
    catch (error) {
        //could add error page
        console.log("getServerSideProps error",error)
    }
}
export default CommunityPage;