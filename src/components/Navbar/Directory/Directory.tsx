import { ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, Menu, MenuButton, MenuList,Icon,Text } from '@chakra-ui/react';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '../../../atoms/authModalAtom';
import {TiHome} from "react-icons/ti"
import Communities from './Communities';

const UserMenu:React.FC = () => {
    const setAuthModalState=useSetRecoilState(authModalState)
    return (
    <Menu>
    <MenuButton cursor="pointer" 
    padding="0px 6px" 
    borderRadius={4} 
    _hover={{outline:"1px solid",outlineColor:"gray.200"}}>
    <Flex align="center" justify="space-between" width={{base:"auto", lg:"200px"}}>
        <Flex align="center">
        <Icon fontSize={24} mr={{base:1,md:2}} as ={TiHome} />
        <Flex display={{base: "none",lg:"flex"}}>
        <Text>Home</Text>
        </Flex>
        </Flex>
    <ChevronDownIcon/>
    </Flex>
    </MenuButton>
    <MenuList>
         {<Communities/>}
    </MenuList>
</Menu>
    )
}
export default UserMenu;