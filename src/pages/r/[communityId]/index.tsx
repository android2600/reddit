import { doc, getDoc } from 'firebase/firestore';
import { GetServerSidePropsContext } from 'next';
import React from 'react';
import { Community } from '../../../atoms/communitiesAtom';
import { firestore } from '../../../firebase/clientApp';
import safeJsonStringify from "safe-json-stringify"
import NotFound from '../../../components/Community/NotFound';
import Header from '../../../components/Community/Header';
import PageContent from '../../../components/Layout/PageContent';
import CreatePostLink from '../../../components/Community/CreatePostLink';
import Posts from '../../../components/Posts/Posts';

type CommunityPageProps = {
    communityData: Community
};

const CommunityPage:React.FC<CommunityPageProps> = ({communityData}) => {
    if (!communityData){
        return <NotFound/> // leads to Not Found Community page
    }
    return (
        <>
        <Header communityData={communityData}/>
        <PageContent>
            <>
            <CreatePostLink/>
            <Posts communityData={communityData}/>
            </> 
            <><div>RHS</div></> 
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