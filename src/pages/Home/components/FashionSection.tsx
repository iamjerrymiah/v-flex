import { Box, Heading, Text, Image, Stack } from "@chakra-ui/react";

import immg from '../../../assets/images/image1.webp'
import { Link } from "react-router";

const FashionSection = () => {
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
            <Box w={['full', 'full', '40%', '35%']}>
                <Text mb={6} fontSize={'18px'}>
                A fusion of modern design and timeless elegance, crafted for the man who appreciates precision and sophistication.
                </Text>
                <Heading 
                    textAlign={{ base: "center", md: "left" }} 
                    size="md"
                >
                    <Link to="/products/vl">Men's Clothing →</Link>
                </Heading>
            </Box>
            <Box flex="1">
                <Image 
                    src={immg} // Update this path
                    alt="Men's Fashion"
                    objectFit="cover"
                    w="full"
                    h={['full', 'full', 'full', '400px']}
                />
            </Box>

        </Stack>
    );
};

export default FashionSection;