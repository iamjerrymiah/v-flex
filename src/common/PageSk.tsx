
import { Box, SimpleGrid, Skeleton } from '@chakra-ui/react'

export default function PageSk() {
    return (
        <Box w='full' borderRadius='md' py={8}>
            <Skeleton borderRadius='md' h='100px' mb={2} />
            <Skeleton borderRadius='md' h='100px' mb={2}/>
            <Skeleton borderRadius='md' h='100px' mb={2}/>
        </Box>
    )
}

export function ProductPageSk() {
    return (
        <SimpleGrid w='full' py={8} columns={[1,2,4]} spacing={[10, 6]}>
            <Skeleton borderRadius='md' h='250px' mb={2}/>
            <Skeleton borderRadius='md' h='250px' mb={2}/>
            <Skeleton borderRadius='md' h='250px' mb={2}/>
            <Skeleton borderRadius='md' h='250px' mb={2}/>
            <Skeleton borderRadius='md' h='250px' mb={2} display={['none', 'none', 'none', 'block']}/>
            <Skeleton borderRadius='md' h='250px' mb={2} display={['none', 'none', 'none', 'block']}/>
            <Skeleton borderRadius='md' h='250px' mb={2} display={['none', 'none', 'none', 'block']}/>
            <Skeleton borderRadius='md' h='250px' mb={2} display={['none', 'none', 'none', 'block']}/>
        </SimpleGrid>
    )
}

export function RecProductPageSk({h}: any) {
    return (
        <Box w='full' py={8}>
            <Skeleton borderRadius='md' w={'100%'} h={h ?? '150px'} mb={2}/>
        </Box>
    )
}
