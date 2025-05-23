import { Box, HStack, Image, Stack, Text } from '@chakra-ui/react';
import { motion } from "framer-motion";

import { capCase, moneyFormat } from '../../../utils/utils';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);

export default function ProductsSection({products}: {products: any}) {

    const navigate = useNavigate()

    return (
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
                {products?.map((p:any, index:any) => (
                    <MotionBox key={index} whileHover={{ scale: 1.05 }} cursor={'pointer'} onClick={() => { navigate(`/products/${p?.slug}?componentsVfproduct=${p?._id}`); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                        <Image src={p?.mainImage} boxSize="200px" borderRadius="lg" />
                        <Stack spacing={'-1'} mt={1}>
                            <Text fontWeight={400}>{capCase(p?.name)}</Text>
                            <Text fontSize="lg" fontWeight="bold">€ {moneyFormat(p?.price)}</Text>
                        </Stack>
                    </MotionBox>
                ))}
            </HStack>
        </Box>
    )
}
