import { Box, Heading, Text, Image, Stack } from "@chakra-ui/react";

import immg from '../../../assets/images/image2.webp'
import { Link } from "react-router";

export default function WomenFashionSection() {
    return (
        <Stack
            w="full"
            mx="auto"
            my={'100px'}
            direction={{ base: "column", md: "row" }}
            align="center"
            justify="space-between"
            spacing={10}
            px={['20px', '20px', '30px', '100px']}
        >
            <Box flex="1">
                <Image 
                    src={immg} // Update this path
                    alt="Men's Fashion"
                    objectFit="cover"
                    w="full"
                    h={['full', 'full', 'full', '400px']}
                />
            </Box>

            <Box w={['full', 'full', '40%', '35%']}>
                <Text mb={6} fontSize={'18px'}>
                Enhance your style with designs that radiate elegance and refinement, meticulously crafted to capture the essence of luxury.
                </Text>
                <Heading 
                    textAlign={{ base: "center", md: "left" }} 
                    size="md"
                >
                    <Link to="#">Women's Clothing →</Link>
                </Heading>
            </Box>

        </Stack>
    )
}
