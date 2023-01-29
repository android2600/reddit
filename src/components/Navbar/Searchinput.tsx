import { CheckIcon, SearchIcon } from '@chakra-ui/icons';
import { Flex, Input, InputGroup, InputLeftElement, InputRightElement, Stack } from '@chakra-ui/react';
import { User } from '@firebase/auth';
import React from 'react';

type SearchinputProps={
    user?: User | null;
}

const Searchinput:React.FC<SearchinputProps> = ({user}) => {
    
    return (
    <Flex flexGrow={1} mr={2} align="center" maxWidth={user?"auto":"600px"}>
        <InputGroup>
            <InputLeftElement
            pointerEvents='none'
            children={<SearchIcon color='gray.300' mb={1}/>}
            />
            <Input placeholder='Search Reddit' fontSize="10pt" 
            _placeholder={{color:"grey.500"}}
            _hover={{
                bg:"white",
                border:"1px solid",
                borderColor:"blue.500",
            }}
            _focus={{
                outline:"none",
                border:"1px solid",
                borderColor:"blue.500"
            }}
            height="34px"
            bg="gray.50"
            />
        </InputGroup>
    </Flex>
        )
}
export default Searchinput;