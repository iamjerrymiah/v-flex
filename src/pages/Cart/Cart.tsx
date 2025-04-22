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
  } from "@chakra-ui/react";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { useState } from "react";
// import pic from '../../assets/images/sneaker3.webp'
import Loader from "../../common/Loader";
import PageSk from "../../common/PageSk";
import EmptyListHero from "../../common/EmptyListHero";
import { allCaps, capCase, moneyFormat } from "../../utils/utils";
import { useGetUserCarts } from "../../hooks/user/users";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { useNavigate } from "react-router";
import { useGetAuthState } from "../../hooks/auth/AuthenticationHook";
  
//   interface CartItem {
//     id: string;
//     name: string;
//     image: string;
//     price: number;
//     quantity: number;
//   }
  
//   const mockCart: any[] = [
//     {
//       product: {
//         id: "1",
//         name: "Modern Leather Bag",
//         mainImage: pic,
//         price: 89.99,
//       },
//       quantity: 1,
//     },
//   ];


function CartsMain ({ carts = [], isLoading = false }:any) {
    
    const navigate = useNavigate()
    const { isAuthenticated } =  useGetAuthState();

    const [cartItems, setCartItems] = useState<any[]>(carts);

    const handleRemoveItem = (id: string) => {
      setCartItems((prev) => prev.filter((item) => item._id !== id));
    };

    const handleUpdateQty = (id: string, type: "increment" | "decrement") => {
        setCartItems((prev) =>
          prev.map((item) =>
            item._id === id
              ? {
                  ...item,
                  quantity:
                    type === "increment"
                      ? item?.quantity + 1
                      : Math.max(1, item?.quantity - 1),
                }
              : item
          )
        );
    };
  
    const subtotal = cartItems.reduce((acc, item) => acc + item?.product?.price * item?.quantity, 0);
    const tax = subtotal * 0.07; //tax
    const total = subtotal + tax;


    return(
        <Box pt={10}>

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
                                <Loader />
                                <PageSk />
                            </>
                        ) : 
                        cartItems.length <= 0 ? (
                            <Center mt={[4, 10]}>
                                <EmptyListHero
                                    w="400px"
                                    text={isAuthenticated ? "Your cart is empty 😕" : "You need to log in to access your cart!"} 
                                />
                            </Center>
                        ) :
                        <>
                            {cartItems.map((item, i) => (
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
                                        />
                                        <Box flex={1}>
                                            <Text fontSize={['md', "lg"]} fontWeight="semibold">{capCase(item?.product?.name)}</Text>
                                            <Text color="gray.800">€ {moneyFormat(item?.product?.price)}</Text>
                                            <Text color={["white", "#fff", "#FFF", "#FFFFFF", "#ffffff"].includes(item?.color)
                                                        ? "gray.500"
                                                        : item?.color ?? "gray.500"}>Color: {item?.color}</Text>
                                            <Text color="gray.800">Size: {allCaps(item?.size)}</Text>
                                            <Text color="gray.800">Available: {item?.product?.availability == true ? "YES" : "NO"}</Text>
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
                    display={cartItems.length <= 0 ? 'none': 'block'}
                >
                    <Text fontSize="xl" fontWeight="bold" mb={6}> Summary </Text>
        
                    <Flex justify="space-between" mb={2}>
                        <Text>Subtotal</Text>
                        <Text>€ {moneyFormat(subtotal)}</Text>
                    </Flex>
                    <Flex justify="space-between" mb={2}>
                        <Text>Tax (7%)</Text>
                        <Text>€ {moneyFormat(tax)}</Text>
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
                        isDisabled={cartItems.length === 0}
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
            <MainAppLayout>
                <AnimateRoute>
                    <Container>
                        <CartsMain 
                            carts={carts?.cart} 
                            isLoading={isLoading} 
                        />
                    </Container>
                </AnimateRoute>
            </MainAppLayout>
        </PageMainContainer>
    )
}
