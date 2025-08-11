import AnimateRoute from "../../common/AnimateRoute"
import PageMainContainer from "../../common/PageMain"
import MainAppLayout from "../../layouts/MainAppLayout"
import { 
    Box, Image, Text, Button, Grid, GridItem, Stack, HStack, VStack, 
    Select,
    Heading,
    Input,
    Tooltip,
    Badge,
    Divider,
} from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight, FaShoppingCart, FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
// import Loader from "../../common/Loader";
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
    user = {},
    product = {}, 
    recProducts = [], 
    recLoad 
}:{product: any, recProducts: any, recLoad?: boolean, isLoading: boolean, user?:any; isAuthenticated: boolean | null}) {

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

    const oldPrice = product?.price / (1 - product?.discount / 100);

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
                    <PageSk />
                </>
            ) :
            <Grid 
                templateColumns={["1fr","1fr","1fr","1.5fr 1fr"]} 
                gap={10} 
            >

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
                                w={["100%","100%","100%",'700px']}
                                h={["auto","auto","auto",'500px']}
                            />
                            
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
    
                <GridItem>
                    <Stack spacing={4}>
                        <Stack spacing={'-1'}>
                            <Text fontSize="2xl" fontWeight="bold">{capCase(product?.name)}</Text>
                            <Badge 
                                px={2} py={1} 
                                color={'white'} 
                                w={product?.availability ? ['23%','15%'] : ['28%','20%']} 
                                bgColor={product?.availability ? 'green.300' : 'red.400'} 
                                borderRadius={'4px'}
                            >
                                {product?.availability ? "Available" : "Out of Stock" }
                            </Badge>

                            <HStack spacing={4} mt={'6px'}>
                                <HStack>
                                    {product?.discount > 0 && <Text color="#D0D5DD" as="s" fontSize="lg">{moneyFormat(oldPrice ?? 0) ?? 0}</Text>}
                                    <Text fontSize="2xl" fontWeight="bold">€{moneyFormat(product?.price) ?? "0.0"}</Text>
                                </HStack>

                                {product?.discount > 0 && <Badge px={2} py={1} bgColor={'#EA4B481A'} borderRadius={'30px'} color="#EA4B48">{product?.discount ?? "0"}% Off</Badge>}
                            </HStack>
                            <Divider mt={3}/>

                        </Stack>
            
                        {/* Description */}
                        <Text color="gray.600">{product?.description}</Text>

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
                            ? "Please log in to add to cart." : !user?.emailVerified ? "Please verify your account" 
                            : carts?.cart?.length >= 1000 ? "You've reached the limit amount in cart(1000)." : ""}
                        >
                            <Button 
                                w="full" 
                                // bg="black" 
                                colorScheme="facebook"
                                color="white" 
                                // _hover={{ bg: "gray.700" }} 
                                leftIcon={<FaShoppingCart />}
                                isDisabled={!isAuthenticated || !user?.emailVerified || carts?.cart?.length >= 1000}
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
                            ? "Please log in to add to wishlist." : !user?.emailVerified ? "Please verify your account"
                            : wishLists?.length >= 1000 ? "You've reached the limit amount in wishlist(1000)." : ""}
                        >
                            <Button 
                                w="full" 
                                bg="gray.300" 
                                color="black" 
                                mt={2} 
                                leftIcon={<FaStar />}
                                isDisabled={!isAuthenticated || !user?.emailVerified  || wishLists?.length >= 1000}
                                isLoading={wishPend}
                                onClick={() => { handleAddWishList() }}
                            >
                                ADD TO WISHLIST
                            </Button>
                        </Tooltip>

                        <Stack px={4} color={'crimson'} spacing={'-1'} fontSize={'11px'}>
                            <ul>
                                {!isAuthenticated && <li>Please log in to get full access!</li>}
                                {isAuthenticated && !user?.emailVerified && <li>Your account is yet to be verified!</li>}
                                {carts?.cart?.length >= 1000 && <li>You've reached the limit amount in cart(1000).</li>}
                                {wishLists?.length >= 1000 && <li>You've reached the limit amount in wishlist(1000).</li>}
                            </ul>
                        </Stack>
                        
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

    const { isAuthenticated, user } = useGetAuthState()

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
                            user={user}
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
