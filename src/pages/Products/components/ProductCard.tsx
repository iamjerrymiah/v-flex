import { Box, Button, GridItem, Icon, Image, Stack, Text } from "@chakra-ui/react";
import { FaCheckToSlot } from "react-icons/fa6";
import { FcCancel } from "react-icons/fc";
import { useNavigate, useParams } from "react-router";
import { capCase, moneyFormat } from "../../../utils/utils";

import noProductImage from '../../../assets/icons/noproduct.png'

const ProductCard = ({ product }:any) => {
    
    const navigate = useNavigate()

    const { category, subCategory } = useParams<{ category: string; subCategory: string }>();
    const link = `/products${category ? `/${category}` : ""}${subCategory ? `/${subCategory}` : ""}/${product?.slug}?componentsVfproduct=${product?._id}`;

    return (
      <GridItem 
        borderRadius="md" 
        position="relative" 
        onClick={() => navigate(link)}
    >

        {/* <Icon as={FaStar} position="absolute" top="10px" left="10px" color="gray" /> */}
  
        <Box position="relative" _hover={{ "& .quick-view": { opacity: 1 } }}>
            <Image 
                src={product?.mainImage ?? noProductImage} 
                alt={product?.name} 
                borderRadius="md"
                transition="transform 0.3s"
                _hover={{ transform: "scale(1.05)" }}
                objectFit={'cover'}
                w={'100%'}
                h={['500px']}
            />
          
            <Button 
                className="quick-view" 
                position="absolute" 
                top="10px" 
                right="10px"
                bg="white" 
                opacity="0"
                _hover={{ bg: "gray.200" }}
                size="xs"
            >
                {product?.availability ? <Icon as={FaCheckToSlot} mr={1} color={'green'}/> : <Icon as={FcCancel} mr={1} />} {product?.availability ? "Available" : "Out of Stock"}
            </Button>
        </Box>
    
        {/* Product Info */}
        <Stack spacing={'-1'} mt={2}>
            {/* {product?.acceptCrypto && (
                <Text fontSize="xs" color="gray.500">WE ACCEPT CRYPTO</Text>
            )} */}
            <Text fontWeight={500}>{capCase(product?.name)}</Text>
            <Text fontSize="lg" fontWeight="bold">€ {moneyFormat(product?.price)}</Text>
        </Stack>
        
      </GridItem>
    );
};

export default ProductCard;