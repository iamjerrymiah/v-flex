import { Button, Flex, Heading, Text } from '@chakra-ui/react'

export default function PromotionalSection() {
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
            <Button mt={6} size="lg" colorScheme="yellow">Explore Deals</Button>
        </Flex>
    )
}
