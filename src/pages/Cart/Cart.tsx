import AnimateRoute from "../../common/AnimateRoute"
import PageMainContainer from "../../common/PageMain"
import MainAppLayout from "../../layouts/MainAppLayout"
import { Container } from "../../styling/layout"
import {
    Box,
    Flex,
    Text,
    Image,
    IconButton,
    Button,
    Divider,
    Heading,
    Center,
    HStack,
    Spinner,
  } from "@chakra-ui/react";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
// import Loader from "../../common/Loader";
import PageSk from "../../common/PageSk";
import EmptyListHero from "../../common/EmptyListHero";
import { allCaps, capCase, moneyFormat } from "../../utils/utils";
import { useDeleteCartProduct, useGetUserCarts, useUpdateCartProduct } from "../../hooks/user/users";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { useNavigate } from "react-router";
import { useGetAuthState } from "../../hooks/auth/AuthenticationHook";
import { BsClipboard2CheckFill, BsClipboardXFill } from "react-icons/bs";


function CartsMain ({ carts = [], isLoading }:any) {
    
    const navigate = useNavigate()
    const { isAuthenticated } =  useGetAuthState();

    // const [cartItems, setCartItems] = useState<any[]>(carts);

    const { mutateAsync: updateCartAction, isPending } = useUpdateCartProduct()
    const { mutateAsync: removeCartAction, isPending: removePend } = useDeleteCartProduct()

    const handleRemoveItem = async (id: string) => {
    //   setCartItems((prev) => prev.filter((item) => item._id !== id));
        try { 
            const res:any = await removeCartAction({ id: id }); 
            return res 
        } catch(e:any) {return e}
    };

    const handleUpdateQty = async (id: string, type: "increment" | "decrement") => {
        const item = carts?.find((item:any) => item?._id === id);
        if (!item) return;

        const newQuantity = type === "increment"
        ? item.quantity + 1
        : Math.max(1, item.quantity - 1);

        try {
            const res = await updateCartAction({
                cartId: id,
                quantity: newQuantity,
                size: item.size,
                color: item.color
            });

            return res
        } catch (e) {
            return e;
        }
    };

    // const handleUpdateQty = (id: string, type: "increment" | "decrement") => {
    //     setCartItems((prev) =>
    //       prev.map((item) =>
    //         item._id === id
    //           ? {
    //               ...item,
    //               quantity:
    //                 type === "increment"
    //                   ? item?.quantity + 1
    //                   : Math.max(1, item?.quantity - 1),
    //             }
    //           : item
    //       )
    //     );
    // };
  
    const subtotal = carts?.reduce((acc:any, item:any) => acc + item?.product?.price * item?.quantity, 0);
    // const tax = subtotal * 0.07; //tax
    const total = subtotal;

    // useEffect(() => { if(!isLoading) { setCartItems(carts) } }, [isLoading])


    return(
        <Box py={6}>

            {isPending || removePend ?
                <Box
                    position="fixed"
                    top={0}
                    left={0}
                    width="100vw"
                    height="100vh"
                    bg="rgba(255, 255, 255, 0.5)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    zIndex={9999}
                >
                    <Spinner size="xl" color="blue.500" thickness="4px" />
                </Box> : null
            }

            <Heading textAlign="center" fontSize={["24px", '30px']} fontWeight={400} my={10}> CART </Heading>

            <Button
                leftIcon={<MdOutlineArrowBackIos />}
                variant="ghost"
                onClick={() => navigate(-1)}
                my={4}
                textDecor={'underline'}
            >
                Back
            </Button>

            <Flex direction={{ base: "column", md: "row" }} pt={6} gap={4}>

                <Box flex={3} borderRadius="xl">
                        {isLoading ? (
                            <>
                                {/* <Loader /> */}
                                <PageSk tiny/>
                            </>
                        ) : 
                        carts?.length <= 0 ? (
                            <Center mt={[4, 10]}>
                                <EmptyListHero
                                    w="400px"
                                    text={isAuthenticated ? "Your cart is empty 😕" : "You need to log in to access your cart!"} 
                                />
                            </Center>
                        ) :
                        <>
                            {carts?.map((item:any, i:any) => (
                                <Flex
                                    key={i}
                                    direction={{ base: "column", md: "row" }}
                                    align="flex-start"
                                    justify="space-between"
                                    mb={6}
                                    p={4}
                                    border="1px solid #eee"
                                    borderRadius="lg"
                                    gap={4}
                                >
                                    <HStack w={['100%', '60%']} spacing={2} mr={2}>
                                        <Image
                                            src={item?.product?.mainImage}
                                            alt={item?.product?.name}
                                            boxSize="80px"
                                            objectFit="cover"
                                            borderRadius="md"
                                            cursor={'pointer'}
                                            onClick={() => navigate(`/products/${item?.product?.slug}?componentsVfproduct=${item?.product?._id}`)}
                                        />
                                        <Box flex={1}>
                                            <Text 
                                                fontSize={['md', "lg"]} 
                                                fontWeight="semibold"
                                                cursor={'pointer'}
                                                _hover={{ color: 'gray' }}
                                                onClick={() => navigate(`/products/${item?.product?.slug}?componentsVfproduct=${item?.product?._id}`)}
                                            >
                                                {capCase(item?.product?.name)}
                                            </Text>
                                            <Text color="gray.800">€ {moneyFormat(item?.product?.price)}</Text>
                                            <Text>Color: {capCase(item?.color)}</Text>
                                            <Text color="gray.800">Size: {allCaps(item?.size)}</Text>
                                            {/* <Text color="gray.800">Available: {item?.product?.availability == true ? "YES" : "NO"}</Text> */}
                                            <HStack><Text color="gray.500">Available:</Text> <Text>{item?.product?.availability == true ? <BsClipboard2CheckFill color="green" size={20}/> : <BsClipboardXFill color="red" size={20}/>}</Text></HStack>
                                        </Box>
                                    </HStack>

                                    {/* <Box>
                                        <Text display={[ 'none', 'block' ]} fontWeight={'bold'}>€ {item.price.toFixed(2)}</Text>
                                    </Box> */}

                                    <Flex
                                        direction={{ base: "row", sm: "row" }}
                                        align="center"
                                        gap={3}
                                        w="full"
                                        justify="space-between"
                                        pt={[0,4]}
                                    >
                                        {/* Quantity Controls */}
                                        <HStack>
                                            <IconButton
                                                icon={<FiMinus />}
                                                aria-label="Decrease quantity"
                                                size="sm"
                                                onClick={() => handleUpdateQty(item._id, "decrement")}
                                            />
                                            <Text minW="20px" textAlign="center">
                                                {item.quantity}
                                            </Text>
                                            <IconButton
                                                icon={<FiPlus />}
                                                aria-label="Increase quantity"
                                                size="sm"
                                                onClick={() => handleUpdateQty(item._id, "increment")}
                                            />
                                        </HStack>

                                        <IconButton
                                            icon={<FiTrash2 />}
                                            aria-label="Remove item"
                                            variant="ghost"
                                            colorScheme="red"
                                            onClick={() => handleRemoveItem(item._id)}
                                        />
                                    </Flex>
                                </Flex>
                            ))}
                        </>}

                </Box>
        
                {/* Summary */}
                <Box
                    flex={1}
                    bg="white"
                    p={6}
                    borderRadius="xl"
                    shadow="md"
                    minW={{ base: "100%", md: "300px" }}
                    display={carts?.length <= 0 ? 'none': 'block'}
                >
                    <Text fontSize="xl" fontWeight="bold" mb={6}> Summary </Text>
        
                    <Flex justify="space-between" mb={2}>
                        <Text>Subtotal</Text>
                        <Text>€ {moneyFormat(subtotal)}</Text>
                    </Flex>
                    <Flex justify="space-between" mb={2}>
                        <Text>Delivery Fee</Text>
                        <Text>€ {moneyFormat(0)}</Text>
                    </Flex>
                    <Divider my={3} />
                    <Flex justify="space-between" fontWeight="bold" fontSize="lg">
                        <Text>Total</Text>
                        <Text>€ {moneyFormat(total)}</Text>
                    </Flex>
            
                    <Button 
                        mt={6}
                        w="full" 
                        bg="black" 
                        color="white" 
                        _hover={{ bg: "gray.700" }} 
                        isDisabled={carts?.length === 0}
                    >
                        Proceed to Checkout
                    </Button>
                </Box>
                
            </Flex>
        </Box>
    )
}

export default function CartPage() {

    const { data: cartData = {}, isLoading } = useGetUserCarts({})
    const { data: carts = {} } = cartData

    return (
        <PageMainContainer title='Carts' description='Carts'>
            <MainAppLayout noFooter>
                <AnimateRoute>
                    <Container>
                        <CartsMain 
                            carts={carts?.cart ?? []} 
                            isLoading={isLoading} 
                        />
                    </Container>
                </AnimateRoute>
            </MainAppLayout>
        </PageMainContainer>
    )
}
