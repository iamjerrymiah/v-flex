import { Button, Flex, Heading, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router'

export default function PromotionalSection() {
    const navigate = useNavigate()

    return (
        <Flex 
            bg="gray.800" 
            color="white" 
            py={20} 
            px={10} 
            direction="column" 
            align="center" 
            textAlign="center"
        >
            <Heading fontSize={['3xl', '3xl', '3xl', "4xl"]}>Limited Time Offers</Heading>
            <Text fontSize="xl" mt={4}>Grab exclusive discounts on premium fashion items</Text>
            <Button mt={6} size="lg" colorScheme="yellow" onClick={()=> navigate(`/products/vl?deals=top-discounts`)}>Explore Deals</Button>
        </Flex>
    )
}
