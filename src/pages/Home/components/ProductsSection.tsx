import { Box, Heading, HStack, Image } from '@chakra-ui/react';
import { motion } from "framer-motion";

import sneaker1 from '../../../assets/images/sneaker1.webp'
import sneaker2 from '../../../assets/images/sneaker2.webp'
import sneaker3 from '../../../assets/images/sneaker3.webp'
import sneaker4 from '../../../assets/images/sneaker4.webp'
import sneaker5 from '../../../assets/images/sneaker5.webp'
import sneaker6 from '../../../assets/images/sneaker6.webp'
import sneaker7 from '../../../assets/images/sneaker7.webp'
import sneaker8 from '../../../assets/images/sneaker8.webp'
import sneaker9 from '../../../assets/images/sneaker9.webp'
import sneaker10 from '../../../assets/images/sneaker10.webp'

const MotionBox = motion(Box);

const images = [
    sneaker1, sneaker2, sneaker9, sneaker5, sneaker6, sneaker10, sneaker7, sneaker8, sneaker3, sneaker4
];

export default function ProductsSection() {
    return (
        <Box my={'100px'} px={['20px', '20px', '30px', '50px']}>
            <Heading fontSize={['36px', '46px']} fontWeight={400} mb={6}>SNEAKERS</Heading>
            <Box
                overflowX="scroll"
                px={[5, 0]}
                css={{
                    scrollbarWidth: "none", // Hide scrollbar for Firefox
                    "-ms-overflow-style": "none", // Hide scrollbar for IE/Edge
                    "&::-webkit-scrollbar": {
                    display: "none", // Hide scrollbar for Chrome/Safari
                    },
                }}
            >
                <HStack spacing={5} w="max-content">
                    {images.map((img, index) => (
                        <MotionBox key={index} whileHover={{ scale: 1.05 }}>
                            <Image src={img} boxSize="400px" borderRadius="lg" />
                        </MotionBox>
                    ))}
                </HStack>
            </Box>
        </Box>
    )
}
