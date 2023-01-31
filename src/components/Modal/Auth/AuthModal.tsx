import { Text,Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState } from 'recoil';
import { authModalState } from '../../../atoms/authModalAtom';
import { auth } from '../../../firebase/clientApp';
import AuthInputs from './AuthInputs';
import OAuthButton from './OAuthButton';
import ResetPassword from './ResetPassword';

const AuthModal:React.FC = () => {
    const [modalState,setModalState]=useRecoilState(authModalState)
    const handleClose=()=>{
        setModalState((prev)=>({
            ...prev,
            open:false
        }))
    }
    const [user,loading,error]=useAuthState(auth)

    useEffect(()=>{
        if (user) handleClose();
    },[user])
    
  return (
    <>
      <Modal isOpen={modalState.open} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            {modalState.view==="login" && "Login"}
            {modalState.view==="signup" && "SignUp"}
            {modalState.view==="resetPassword" && "Reset Password"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          >
            <Flex 
            direction="column"
            align="center"
            justify="center"
            width="70%"
            pb={6}
            >
              {modalState.view==="login" || modalState.view==="signup" ? (
                <>
                <OAuthButton/>
                <Text style={{color:'grey', fontWeight:700}}>OR</Text>
                <AuthInputs/>
                </>
                ):(<ResetPassword/>)}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
export default AuthModal;