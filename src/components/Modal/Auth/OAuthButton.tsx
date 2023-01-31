import { Button, Flex,Image,Text } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import { setDoc, collection, doc } from 'firebase/firestore';
import React, { useEffect } from 'react';
import {useSignInWithGoogle} from "react-firebase-hooks/auth"
import {auth, firestore} from "../../../firebase/clientApp"



const OAuthButton:React.FC = () => {
    const [signInWithGoogle,userCred,loading,error]=useSignInWithGoogle(auth)
    
    /* without using cloud firebase functions */
    // const createUserDocument=async(user:User) => {
    //     const userDocRef= doc(firestore,"users",user.uid)
    //     await setDoc(userDocRef,JSON.parse(JSON.stringify(user)))
    // }
    // useEffect(()=>{
    //     if(userCred){
    //         createUserDocument(userCred.user)
    //     }
    // })

    return (
    <Flex direction="column" width="100%" mb={2}>
        <Button variant="oauth" mb={2}
        isLoading={loading}
        onClick={()=>signInWithGoogle()}>
            <Image src="/images/googlelogo.png" height="20px" mr={4}></Image>
            Continue with Google
        </Button>
        <Button variant="oauth" mb={2}>Some other provider</Button>
        {error && <Text>{error.message}</Text>}
    </Flex>
    )
}
export default OAuthButton;