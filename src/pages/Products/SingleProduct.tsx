import AnimateRoute from "../../common/AnimateRoute"
import PageMainContainer from "../../common/PageMain"
import MainAppLayout from "../../layouts/MainAppLayout"
import { 
    Box, Image, Text, Button, Grid, GridItem, Stack, HStack, VStack, 
    Select,
    // Accordion,
    // AccordionItem,
    // AccordionButton,
    // AccordionIcon,
    // AccordionPanel
} from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight, FaShoppingCart, FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Loader from "../../common/Loader";
import { useGetAuthState } from "../../hooks/auth/AuthenticationHook";
import { useGetProduct } from "../../hooks/products/products";

import noProductImg from '../../assets/icons/noproduct.png'
import { capCase } from "../../utils/utils";
import { Container } from "../../styling/layout";
import PageSk from "../../common/PageSk";
// import ProductsSection from "./components/ProductsSection";
  
const emptyProduct = {
    name: "-",
    category: "-",
    price: "-",
    mainImage: noProductImg,
    description: "",
    images: [],
    details: [],
    colors: [],
    sizes: []
};

function SingleProductMain({ isAuthenticated, isLoading, product = {} }:{product: any, isLoading: boolean, isAuthenticated: boolean}) {

    console.log(isAuthenticated)
    const [selectedIndex, setSelectedIndex] = useState(0);
    // const isMobile = useBreakpointValue({ base: true, md: false });

    const productImages = Array.isArray(product?.images)
    ? [product?.mainImage, ...product.images]
    : product?.mainImage
    ? [product?.mainImage]
    : [];
  
    const handleNext = () => {
        setSelectedIndex((prevIndex) => (prevIndex + 1) % productImages?.length);
    };
  
    const handlePrev = () => {
        setSelectedIndex((prevIndex) =>
            prevIndex === 0 ? productImages?.length - 1 : prevIndex - 1
        );
    };

    const [selectedColor, setSelectedColor] = useState(product?.colors[0]);
    const [selectedSize, setSelectedSize] = useState(product?.sizes[0]);
  
    // Enable keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowRight") handleNext();
            if (event.key === "ArrowLeft") handlePrev();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <Box>
            {isLoading ? (
                <>  
                    <Loader /> 
                    <PageSk />
                </>
            ) :
            <Grid 
                templateColumns={{ base: "1fr", md: "1.5fr 1fr" }} 
                gap={10} 
                // alignItems="center"
            >
                {/* Left Side: Product Image Gallery */}
                <GridItem>
                    <VStack spacing={4} align="start">
                        {/* Thumbnails */}
                        <HStack 
                            spacing={3}
                            overflowX="scroll"
                            css={{
                                scrollbarWidth: "none",
                                "-ms-overflow-style": "none", 
                                "&::-webkit-scrollbar": {
                                display: "none",
                                },
                            }}
                        >
                            {productImages?.map((img:any, idx:any) => (
                                <Image 
                                    key={idx} 
                                    src={img ?? noProductImg} 
                                    alt={`Thumbnail ${idx}`} 
                                    w="100px" 
                                    h="100px"
                                    borderRadius="md"
                                    cursor="pointer"
                                    border={selectedIndex === idx ? "2px solid black" : "none"}
                                    onClick={() => setSelectedIndex(idx)}
                                />
                            ))}
                        </HStack>
                        <Box position="relative">
                            <Image 
                                src={productImages[selectedIndex] ?? noProductImg} 
                                alt={product.name} 
                                borderRadius="md"
                                objectFit={'contain'}
                                w={["100%", '700px']}
                                h={["auto", '500px']}
                                // w={'100%'}
                                // h={'auto'}
                            />
                            
                            {/* Navigation Arrows */}
                            <Button 
                                position="absolute" 
                                top="50%" left="5%" 
                                transform="translateY(-50%)"
                                onClick={handlePrev}
                                variant="ghost"
                                _hover={{ bg: "rgba(0,0,0,0.3)" }}
                                color="gray"
                            >
                                <FaChevronLeft size="24px" />
                            </Button>

                            <Button 
                                position="absolute" 
                                top="50%" right="5%" 
                                transform="translateY(-50%)"
                                onClick={handleNext}
                                variant="ghost"
                                _hover={{ bg: "rgba(0,0,0,0.3)" }}
                                color="gray"
                            >
                                <FaChevronRight size="24px" />
                            </Button>
                        </Box>
                    </VStack>
                </GridItem>
    
                {/* Right Side: Product Details */}
                <GridItem>
                    <Stack spacing={4}>
                        <Stack spacing={'-1'}>
                            <Text fontSize="2xl" fontWeight="bold">{capCase(product.name)}</Text>
                            <Text color="gray.500">{capCase(product.category)}</Text>
                            <Text fontSize="xl" fontWeight="bold">€{product.price}</Text>
                        </Stack>
            
                        {/* Description */}
                        <Text color="gray.600">{product.description}</Text>
            
                        {/* Product Details */}
                        {/* <VStack align="start">
                            {product.details.map((detail:any, index:any) => (
                            <Text key={index} fontSize="sm" color="gray.700">
                                • {detail}
                            </Text>
                            ))}
                        </VStack> */}

                        {/* Color Selection */}
                        <Text fontWeight="bold" mb={2}>COLOR: <Text as="span" fontWeight="normal">{capCase(selectedColor)}</Text></Text>
                        <HStack spacing={2} mb={4}>
                            {product?.colors?.map((color:any, index:any) => (
                            <Box 
                                key={index} 
                                w="24px" h="24px" 
                                bg={color} 
                                border="2px solid"
                                borderColor={selectedColor === color ? "black" : "gray.300"} 
                                borderRadius="full"
                                cursor="pointer"
                                onClick={() => setSelectedColor(color)}
                            />
                            ))}
                        </HStack>

                        {/* Size Selection */}
                        <Select mb={4} value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                            {product?.sizes?.map((size:any, index:any) => (
                            <option key={index} value={size}>{size}</option>
                            ))}
                        </Select>

                        {/* Wishlist Button */}
                        {/* <HStack spacing={2} mb={4} cursor="pointer">
                            <Icon as={FaStar} color="gray.500" />
                            <Text color="gray.500">ADD TO WISHLIST</Text>
                        </HStack> */}

                        {/* Buttons */}
                        <Button 
                            w="full" 
                            bg="gray.300" 
                            color="black" 
                            mt={2} 
                            leftIcon={<FaStar />}
                        >
                            ADD TO WISHLIST
                        </Button>

                        <Button 
                            w="full" 
                            bg="black" 
                            color="white" 
                            _hover={{ bg: "gray.700" }} 
                            leftIcon={<FaShoppingCart />}
                        >
                            ADD TO CART
                        </Button>
                        
                        {/* Icons Section */}
                        {/* <HStack w={'100%'} spacing={6} mt={6} justify="center">
                            <Tooltip label="Crypto Payment">
                            <Icon as={FaEthereum} boxSize={6} />
                            </Tooltip>
                            <Tooltip label="Free Returns">
                            <Icon as={FaUndo} boxSize={6} />
                            </Tooltip>
                            <Tooltip label="Pick Up in Store">
                            <Icon as={FaBox} boxSize={6} />
                            </Tooltip>
                        </HStack> */}

                        {/* Accordion - Expandable Sections */}
                        {/* <Accordion allowToggle mt={6}>
                            <AccordionItem>
                                <AccordionButton>
                                    <Box flex="1" textAlign="left">PRODUCT DETAILS</Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel pb={4}>
                                    High-quality materials and premium comfort for your daily wear.
                                </AccordionPanel>
                            </AccordionItem>

                            <AccordionItem>
                                <AccordionButton>
                                    <Box flex="1" textAlign="left">COMPOSITION</Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel pb={4}>
                                    70% Synthetic, 30% Leather.
                                </AccordionPanel>
                            </AccordionItem>

                            <AccordionItem>
                                <AccordionButton>
                                    <Box flex="1" textAlign="left">DELIVERY & RETURNS</Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel pb={4}>
                                    Free returns within 30 days of purchase.
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion> */}
                    </Stack>
                </GridItem>
        </Grid> }

        {/* Recommend Product */}
        {/* <ProductsSection /> */}

      </Box>
    )
}

export default function SingleProduct () {

    const [searchParams] = useSearchParams();
    const productId = searchParams.get("componentsVfproduct");

    const { isAuthenticated } = useGetAuthState()

    // // const { isAuthenticated } = useGetAuthState()
    const { data: productData = {}, isLoading } = useGetProduct(productId)
    const product = productData?.data


    return(
        <PageMainContainer title='' description=''>
            <MainAppLayout mt={['85px', '90px', '90px', '90px']}>
                <AnimateRoute>
                    <Container>
                        <SingleProductMain 
                            isAuthenticated={isAuthenticated}
                            product={product ?? emptyProduct} 
                            isLoading={isLoading}
                        />
                    </Container>
                </AnimateRoute>
            </MainAppLayout>
        </PageMainContainer>
    )
}
