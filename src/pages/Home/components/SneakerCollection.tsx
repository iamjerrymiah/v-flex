import { Box, Button, Image, Text } from "@chakra-ui/react";

import imgg from '../../../assets/images/image3.webp'
import { useNavigate } from "react-router";

const SneakerCollection = () => {

    const navigate = useNavigate()

    return (
        <Box 
            position="relative" 
            w="full" 
            h={{ base: "70vh", md: "90vh" }} 
            overflow="hidden"
            mb={'100px'}
        >

            <Image 
                src={imgg}  // Replace with actual image URL
                alt="Luxury Sneakers"
                w="full"
                h="full"
                objectFit="cover"
            />
        
            <Box 
                position="absolute" 
                top="50%" 
                left="50%" 
                transform="translate(-50%, -50%)" 
                textAlign="center"
                color="white"
                onClick={()=> navigate("/products/vl")}
            >
                <Text 
                    fontSize={{ base: "3xl", md: "5xl" }} 
                    fontWeight="bold"
                >
                    New Collection
                </Text>
        
                <Box mt={4} display="flex" justifyContent="center" gap={4}>
                    <Button 
                        color={'blackAlpha.800'} 
                        variant="outline" 
                        colorScheme="whiteAlpha" 
                        size="lg"
                        onClick={()=> navigate("/products/vl")}
                    >
                        Discover Men
                    </Button>
                    <Button 
                        color={'blackAlpha.800'} 
                        variant="outline" 
                        colorScheme="whiteAlpha" 
                        size="lg"
                    >
                        Discover Women
                    </Button>
                </Box>

            </Box>
        </Box>
      );
    };

export default SneakerCollection;