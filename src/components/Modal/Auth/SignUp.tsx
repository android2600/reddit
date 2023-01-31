import { Input, Button, Flex } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '../../../atoms/authModalAtom';
import { auth, firestore } from '../../../firebase/clientApp';
import {useCreateUserWithEmailAndPassword} from "react-firebase-hooks/auth"
import {FIREBASE_ERRORS } from '../../../firebase/error';
import { addDoc, collection } from 'firebase/firestore';
import { User } from 'firebase/auth';
type SignUpProps = {

};

const SignUp:React.FC<SignUpProps> = () => {
    const [signUpForm,setSignUpForm]=useState({
        email:"",
        password:"",
        confirmPassword:""
    })
    //Firebase Logic
    const [error,setError]=useState("")
    
    const [
        createUserWithEmailAndPassword,
        userCred,
        loading,
        useError,
      ] = useCreateUserWithEmailAndPassword(auth);
    
      const onSubmit=(event:React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault()
        if (error) setError("") //reseting the error
        if (signUpForm.password!=signUpForm.confirmPassword){
            setError("Password do not match")
            return
        }
        createUserWithEmailAndPassword(signUpForm.email,signUpForm.password)
    
    }
    
    function onChange(event: React.ChangeEvent<HTMLInputElement> ){
        const value = event.target.value;
        setSignUpForm({
            ...signUpForm,
            [event.target.name]:value
        })
    }
    const setAuthModalState=useSetRecoilState(authModalState)
    
    /* without using cloud firebase functions */
    // const createUserDocument=async(user:User) => {
    //     await addDoc(collection(firestore,"users"),JSON.parse(JSON.stringify(user)))
    // }
    // useEffect(()=>{
    //     if(userCred){
    //         createUserDocument(userCred.user)
    //     }
    // })
    
    return (
        <form onSubmit={onSubmit}>
            <Input 
            required
            name="email" placeholder='email'
            type="email" mb={2}
            value={signUpForm.email}
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
            value={signUpForm.password}
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
            <Input 
            required
            name="confirmPassword" placeholder="confirm password"
            type="password"
            value={signUpForm.confirmPassword}
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
            <text style={{textAlign:"center",color:"red",fontSize:"10pt"}}>
                {error || FIREBASE_ERRORS[useError?.message as keyof typeof FIREBASE_ERRORS]}
            </text>
            <Button width="100%" height="36px" mt={2} type="submit" isLoading={loading}>
                Sign Up
            </Button>
            <Flex fontSize="9pt" justifyContent="center">
            <text style={{margin:2}}> 
            Already a redditer?
            </text>
            
            <text 
            style={{cursor:"pointer",color:"blue",fontWeight:700,margin:2}} 
            onClick={()=>setAuthModalState(prev=>({...prev,view:"login"}))}>
            Log In
            </text>
            
            </Flex>
        </form>
        
    )
}
export default SignUp;