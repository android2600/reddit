import { Input, Button, Flex, Icon,Text } from '@chakra-ui/react';
import error from 'next/error';
import React, { useState } from 'react';
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '../../../atoms/authModalAtom';
import { auth } from '../../../firebase/clientApp';
import { FIREBASE_ERRORS } from '../../../firebase/error';
import {BsDot,BsReddit} from "react-icons/bs"

type ResetPasswordProps = {
    
};

const ResetPassword:React.FC<ResetPasswordProps> = () => {
    const setAuthModalState=useSetRecoilState(authModalState)
    const [email,setEmail]=useState("")
    const [success,setSuccess]=useState(false)
    const [sendPasswordResetEmail,sending,error]=useSendPasswordResetEmail(auth)
    
    const onSubmit=async(event:React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault()
        await sendPasswordResetEmail(email)
        setSuccess(true)
    }
    return (
    <Flex direction="column" alignItems="center" width="100%">
    <Icon as={BsReddit} color="brand.100" fontSize={40} mb={2}/>
    <Text fontWeight={700} mb={2}>
        Reset your password
    </Text>
    {success ?
    (<Text mb={4}>Check your email !!</Text>):(
    <>
    <Text fontSize="sm" textAlign="center" mb={2}>
        Enter the email associated with your account and we'll send you a reset link.
    </Text>
    <form onSubmit={onSubmit}>
        <Input 
        required
        name="email" placeholder="email"
        type="email"
        value={email}
        fontSize="10pt"
        onChange={(event)=>setEmail(event.target.value)}
        _placeholder={{color: "gray.500"}}
        mb={2}
        _hover={{
            bg:"white",
            border:"1px solid",
            borderColor:"blue.500",
        }}
        _focus={{
            outline:"none",
            bg:"white",
            border:"1px solid",
            borderColor:"blue.500",
        }}
        bg="gray.50"/>
        <Button width="100%" height="36px" mt={2} type="submit">
            Reset Password
        </Button>
        <Flex fontSize="9pt" justifyContent="center">
        <text 
        style={{cursor:"pointer",color:"blue",fontWeight:700,margin:2}} 
        onClick={()=>setAuthModalState(prev=>({...prev,view:"login"}))}>
        LOGIN
        </text>
        <Icon as={BsDot} color="blue" fontSize={20} alignItems="center"/>
        <text 
        style={{cursor:"pointer",color:"blue",fontWeight:700,margin:2}} 
        onClick={()=>setAuthModalState(prev=>({...prev,view:"signup"}))}>
        SIGN UP
        </text>
        </Flex>
    </form>
    </>)}
    </Flex>
    )
}
export default ResetPassword