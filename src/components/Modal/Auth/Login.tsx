import { Text,Button, Flex, Input } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '../../../atoms/authModalAtom';
import { auth } from '../../../firebase/clientApp';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { FIREBASE_ERRORS } from '../../../firebase/error';

type LoginProps = {};

    const Login:React.FC<LoginProps> = () => {
        const [loginForm,setLoginForm]=useState({
            email:"",
            password:""
        })
        
    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
      ] = useSignInWithEmailAndPassword(auth);

    const onSubmit=(event:React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault()
        signInWithEmailAndPassword(loginForm.email,loginForm.password)
    }
    
    function onChange(event: React.ChangeEvent<HTMLInputElement> ){
        const value = event.target.value;
        setLoginForm({
            ...loginForm,
            [event.target.name]:value
        })
    }
    const setAuthModalState=useSetRecoilState(authModalState)

    return (
        <form onSubmit={onSubmit}>
            <Input 
            required
            name="email" placeholder='email'
            type="email" mb={2}
            value={loginForm.email}
            onChange={onChange}
            fontSize="10pt"
            _placeholder={{color: "gray.500"}}
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
            bg="gray.50"
            />
            <Input 
            required
            name="password" placeholder="password"
            type="password"
            value={loginForm.password}
            onChange={onChange}
            fontSize="10pt"
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
        <Text style={{textAlign:"center",color:"red",fontSize:"10pt"}}>{FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}</Text>
        
        <Button width="100%" height="36px" mt={2} mb={2} isLoading={loading} type="submit">Log In</Button>
        <Flex fontSize="9pt" justifyContent="center">
            <Text style={{margin:2}}> Forgot your password?</Text>
            <Text 
            style={{cursor:"pointer",color:"blue",fontWeight:700,margin:2}} 
            onClick={()=>setAuthModalState(prev=>({...prev,view:"resetPassword"}))}>
            Reset</Text>
        </Flex>
        <Flex fontSize="9pt" justifyContent="center">
            <Text style={{margin:2}}> New here?</Text>
            <Text 
            style={{cursor:"pointer",color:"blue",fontWeight:700,margin:2}} 
            onClick={()=>setAuthModalState(prev=>({...prev,view:"signup"}))}>
            SIGN UP</Text>
        </Flex>
        </form>
        
    )
}
export default Login;