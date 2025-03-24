import { Box, Spinner } from '@chakra-ui/react'


function Loader() {
    return (
        <Box
            width='full'
            height='full'
            display='flex'
            alignItems='center'
            flexDirection='column'
            justifyContent='center'
            position='fixed'
            top={0}
            left={0}
        >
            <Spinner
                thickness='10px'
                speed='0.65s'
                emptyColor='gray.200'
                color={'black'}
                width='100px'
                height='100px'
            />
        </Box>
    )

}

export default Loader