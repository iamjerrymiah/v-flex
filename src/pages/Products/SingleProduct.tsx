import AnimateRoute from "../../common/AnimateRoute"
import PageMainContainer from "../../common/PageMain"
import MainAppLayout from "../../layouts/MainAppLayout"
import { 
    Box, Image, Text, Button, Grid, GridItem, Stack, HStack, VStack, 
    Select,
    Heading,
    Input,
    Tooltip,
    // Accordion,
    // AccordionItem,
    // AccordionButton,
    // AccordionIcon,
    // AccordionPanel
} from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight, FaShoppingCart, FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loader from "../../common/Loader";
import { useGetAuthState } from "../../hooks/auth/AuthenticationHook";
import { useGetProduct, useGetProducts } from "../../hooks/products/products";

import noProductImg from '../../assets/icons/noproduct.png'
import { capCase, moneyFormat } from "../../utils/utils";
import { Container } from "../../styling/layout";
import PageSk, { RecProductPageSk } from "../../common/PageSk";
import ProductsSection from "./components/ProductsSection";
import { useAddProductToCart, useAddProductToWishlist, useGetUserCarts, useGetUserWishlists } from "../../hooks/user/users";
import Notify from "../../utils/notify";
import { MdOutlineArrowBackIos } from "react-icons/md";
  
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

function SingleProductMain({ 
    isAuthenticated, 
    isLoading, 
    product = {}, 
    recProducts = [], 
    recLoad 
}:{product: any, recProducts: any, recLoad?: boolean, isLoading: boolean, isAuthenticated: boolean}) {

    const navigate = useNavigate()

    const { data: wishListData = {} } = useGetUserWishlists({})
    const { data: cartData = {} } = useGetUserCarts({})

    const { data: carts = {} } = cartData
    const { data: wishLists = [] } = wishListData

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

    const [selectedColor, setSelectedColor] = useState<string>("");
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [quantity, setQuantity] = useState<any>(1);

    const { mutateAsync: addWishlistAction, isPending: wishPend } = useAddProductToWishlist()
    const { mutateAsync: addCartAction, isPending: cartPend } = useAddProductToCart()

    const handleAddWishList = async () => {
        try {
            const res:any =  await addWishlistAction({productId: product?._id})

            Notify.success("Product added to wishlist successfully.")
            return res;

        } catch(e:any) {
            Notify.error(e?.message ?? "Failed")
            return e
        }
    }

    const handleAddCart = async () => {
        try {
            const res:any =  await addCartAction({
                product: product?._id,
                size: selectedSize,
                color: selectedColor,
                quantity: quantity
            })

            Notify.success("Product added to cart successfully.")
            return res;

        } catch(e:any) {
            Notify.error(e?.message ?? "Failed")
            return e
        }
    }

    // Enable keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowRight") handleNext();
            if (event.key === "ArrowLeft") handlePrev();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => { 
        setSelectedColor(product?.colors[0]) 
        setSelectedSize(product?.sizes[0]) 
    }, [product?.colors[0], product?.sizes[0]])

    return (
        <Box>
            <HStack justify={'space-between'} w={'100%'} my={4}>
                <Button
                    leftIcon={<MdOutlineArrowBackIos />}
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    textDecor={'underline'}
                >
                    Back
                </Button>

            </HStack>

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
                            <Text fontSize="2xl" fontWeight="bold">{capCase(product?.name)}</Text>
                            <Text color="gray.500">{capCase(product?.category)}</Text>
                            <Text fontSize="xl" fontWeight="bold">€ {moneyFormat(product?.price)}</Text>
                        </Stack>
            
                        {/* Description */}
                        <Text color="gray.600">{product?.description}</Text>
            
                        {/* Product Details */}
                        {/* <VStack align="start">
                            {product.details.map((detail:any, index:any) => (
                            <Text key={index} fontSize="sm" color="gray.700">
                                • {detail}
                            </Text>
                            ))}
                        </VStack> */}

                        <Stack spacing={2}>

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

                            <HStack>
                                <Text w={'13%'}>Size:</Text>
                                <Select mb={4} value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                                    {/* <option value={""}>{"Select Size"}</option> */}
                                    {product?.sizes?.map((size:any, index:any) => (
                                        <option key={index} value={size}>{size}</option>
                                    ))}
                                </Select>
                            </HStack>

                            <HStack>
                                <Text>Quantity:</Text>
                                <Input type="number" value={quantity} placeholder={"Quantity"} onChange={ (e) => setQuantity(e.target.value) }/>
                            </HStack>

                        </Stack>

                        <Tooltip 
                            bgColor={'red.500'}
                            label={!isAuthenticated 
                            ? "Please log in to add to cart." 
                            : carts?.cart?.length >= 1000 ? "You've reached the limit amount in cart." : ""}
                        >
                            <Button 
                                w="full" 
                                bg="black" 
                                color="white" 
                                _hover={{ bg: "gray.700" }} 
                                leftIcon={<FaShoppingCart />}
                                isDisabled={!isAuthenticated || carts?.cart?.length >= 1000}
                                isLoading={cartPend}
                                onClick={() => { handleAddCart() }}
                            >
                                ADD TO CART
                            </Button>
                        </Tooltip>

                        <Tooltip 
                            bgColor={'red.500'}
                            placement="top"
                            label={!isAuthenticated 
                            ? "Please log in to add to wishlist." 
                            : wishLists?.length >= 1000 ? "You've reached the limit amount in wishlist." : ""}
                        >
                            <Button 
                                w="full" 
                                bg="gray.300" 
                                color="black" 
                                mt={2} 
                                leftIcon={<FaStar />}
                                isDisabled={!isAuthenticated || wishLists?.length >= 1000}
                                isLoading={wishPend}
                                onClick={() => { handleAddWishList() }}
                            >
                                ADD TO WISHLIST
                            </Button>
                        </Tooltip>
                        
                    </Stack>
                </GridItem>
        </Grid> }

        {/* Recommend Product */}
        
        <Box mt={'100px'} >
            <Heading fontSize={['16px', '20px']} fontWeight={400} mb={6}>Recommendations</Heading>
                <Box>
                    {recLoad ? (
                        <>
                            <RecProductPageSk />
                        </>
                    ) : recProducts?.length <= 0 ? (
                        <Text>No Recommend Product Found</Text>
                    ) : (
                        <Box mt={2}>
                            <ProductsSection products={recProducts}/>
                        </Box>
                    )}
                </Box>
        </Box>

      </Box>
    )
}

export default function SingleProduct () {

    const [searchParams] = useSearchParams();
    const productId = searchParams.get("componentsVfproduct");

    const { isAuthenticated } = useGetAuthState()

    const { data: productData = {}, isLoading } = useGetProduct(productId)
    const product = productData?.data

    const [filter, setFilter] = useState({
        sortBy: 'recent',
        order: 'shuffle',
        limit: 20,
        categoryId: product?.categories[0]?._id
    })

    const { data: recommendData = {}, isLoading: recLoad } = useGetProducts(filter)
    const { data: recProducts = {} } = recommendData

    useEffect(() => {
        setFilter((prev) => ({
            ...prev,
            categoryId: product?.categories[0]?._id || "",
        }));
    }, [product?.categories[0]?._id]);


    return(
        <PageMainContainer title='' description=''>
            <MainAppLayout mt={['85px', '90px', '90px', '90px']}>
                <AnimateRoute>
                    <Container>
                        <SingleProductMain 
                            isAuthenticated={isAuthenticated}
                            product={product ?? emptyProduct} 
                            recProducts={recProducts?.products ?? []}
                            recLoad={recLoad}
                            isLoading={isLoading}
                        />
                    </Container>
                </AnimateRoute>
            </MainAppLayout>
        </PageMainContainer>
    )
}
