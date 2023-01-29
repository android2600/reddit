import { Button, Flex,Image,Text } from '@chakra-ui/react';
import React from 'react';
import {useSignInWithGoogle} from "react-firebase-hooks/auth"
import {auth} from "../../../firebase/clientApp"



const OAuthButton:React.FC = () => {
    const [signInWithGoogle,user,loading,error]=useSignInWithGoogle(auth)
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