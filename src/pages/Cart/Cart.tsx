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
  import pic from '../../assets/images/sneaker3.webp'
import Loader from "../../common/Loader";
import PageSk from "../../common/PageSk";
import EmptyListHero from "../../common/EmptyListHero";
import { capCase } from "../../utils/utils";
  
  interface CartItem {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }
  
  const mockCart: CartItem[] = [
    {
      id: "1",
      name: "Modern Leather Bag",
      image: pic,
      price: 89.99,
      quantity: 1,
    },
    {
      id: "2",
      name: "Wireless Headphones",
      image: pic,
      price: 120,
      quantity: 2,
    },
  ];


function CartsMain () {

    const isLoading = false

    const [cartItems, setCartItems] = useState<CartItem[]>(mockCart);

    const handleRemoveItem = (id: string) => {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const handleUpdateQty = (id: string, type: "increment" | "decrement") => {
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  quantity:
                    type === "increment"
                      ? item.quantity + 1
                      : Math.max(1, item.quantity - 1),
                }
              : item
          )
        );
    };
  
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * 0.07; //tax
    const total = subtotal + tax;


    return(
        <Box pt={10}>

            <Heading textAlign="center" fontSize={["24px", '30px']} fontWeight={400} my={10}> CART </Heading>

            <Flex direction={{ base: "column", md: "row" }} pt={6} gap={4}>

                <Box flex={3} borderRadius="xl">
                        {isLoading ? (
                            <>
                                <Loader />
                                <PageSk />
                            </>
                        ) : cartItems.length <= 0 ? (
                            <Center mt={10}>
                                <EmptyListHero
                                    w="400px"
                                    text="Your cart is empty 😕" 
                                />
                            </Center>
                        ) :
                        <>
                            {cartItems.map((item, i) => (
                                <Flex
                                    key={i}
                                    align="center"
                                    justify="space-between"
                                    mb={4}
                                    gap={5}
                                    borderBottom="1px solid #eee"
                                    pb={4}
                                >
                                    <HStack w={['60%', '40%']} spacing={2} mr={2}>
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            boxSize="80px"
                                            objectFit="cover"
                                            borderRadius="md"
                                        />
                                        <Box flex={1}>
                                            <Text fontSize={['md', "lg"]} fontWeight="semibold">{capCase(item.name)}</Text>
                                            <Text color="gray.500" display={[ 'block', 'none' ]}>€ {item.price.toFixed(2)}</Text>
                                        </Box>
                                    </HStack>

                                    <Box>
                                        <Text display={[ 'none', 'block' ]} fontWeight={'bold'}>€ {item.price.toFixed(2)}</Text>
                                    </Box>


                                    {/* Quantity Controls */}
                                    <HStack>
                                        <IconButton
                                            icon={<FiMinus />}
                                            aria-label="Decrease quantity"
                                            size="sm"
                                            onClick={() => handleUpdateQty(item.id, "decrement")}
                                        />
                                        <Text minW="20px" textAlign="center">
                                            {item.quantity}
                                        </Text>
                                        <IconButton
                                            icon={<FiPlus />}
                                            aria-label="Increase quantity"
                                            size="sm"
                                            onClick={() => handleUpdateQty(item.id, "increment")}
                                        />
                                    </HStack>

                                    <IconButton
                                        icon={<FiTrash2 />}
                                        aria-label="Remove item"
                                        variant="ghost"
                                        colorScheme="red"
                                        onClick={() => handleRemoveItem(item.id)}
                                    />
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
                >
                    <Text fontSize="xl" fontWeight="bold" mb={6}> Summary </Text>
        
                    <Flex justify="space-between" mb={2}>
                        <Text>Subtotal</Text>
                        <Text>€ {subtotal.toFixed(2)}</Text>
                    </Flex>
                    <Flex justify="space-between" mb={2}>
                        <Text>Tax (7%)</Text>
                        <Text>€ {tax.toFixed(2)}</Text>
                    </Flex>
                    <Divider my={3} />
                    <Flex justify="space-between" fontWeight="bold" fontSize="lg">
                        <Text>Total</Text>
                        <Text>€ {total.toFixed(2)}</Text>
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
    return (
        <PageMainContainer title='Carts' description='Carts'>
            <MainAppLayout>
                <AnimateRoute>
                    <Container>
                        <CartsMain />
                    </Container>
                </AnimateRoute>
            </MainAppLayout>
        </PageMainContainer>
    )
}
