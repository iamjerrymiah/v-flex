
import { Box, Skeleton } from '@chakra-ui/react'

export default function PageSk() {
    return (
        <Box w='full' borderRadius='md' py={8}>
            <Skeleton borderRadius='md' h='100px' mb={2} />
            <Skeleton borderRadius='md' h='100px' mb={2}/>
            <Skeleton borderRadius='md' h='100px' mb={2}/>
            {/* <Skeleton borderRadius='md' h='100px' mb={2}/>
            <Skeleton borderRadius='md' h='100px' mb={2}/> */}
        </Box>
    )
    }
