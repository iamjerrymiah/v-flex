import AnimateRoute from "../../common/AnimateRoute";
import PageMainContainer from "../../common/PageMain";
import MainAppLayout from "../../layouts/MainAppLayout";
import { Container } from "../../styling/layout";
import {
    Box,
    Flex,
    Text,
    Image,
    IconButton,
    Heading,
    Center,
    HStack,
    Button,
  } from "@chakra-ui/react";
  import { FiMinus, FiPlus } from "react-icons/fi";
  import { useState } from "react";
  import pic from '../../assets/images/sneaker3.webp'
import Loader from "../../common/Loader";
import PageSk from "../../common/PageSk";
import EmptyListHero from "../../common/EmptyListHero";
import { capCase } from "../../utils/utils";
import { MdCancel } from "react-icons/md";
// import { FaShoppingCart } from "react-icons/fa";

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

function WaitlistMain () {

    const isLoading = false

    const [wishListItems, setWishlistItems] = useState<CartItem[]>(mockCart);

    const handleRemoveItem = (id: string) => {
      setWishlistItems((prev) => prev.filter((item) => item.id !== id));
    };

    const handleUpdateQty = (id: string, type: "increment" | "decrement") => {
        setWishlistItems((prev) =>
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

    return (
        <Box pt={10}>
            <Heading textAlign="center" fontSize={["24px", '30px']} fontWeight={400} mb={10}> MY WISHLIST </Heading>

                <Box flex={3} borderRadius="xl">
                        {isLoading ? (
                            <>
                                <Loader />
                                <PageSk />
                            </>
                        ) : wishListItems.length <= 0 ? (
                            <Center mt={10}>
                                <EmptyListHero
                                    w="400px"
                                    text="You have no items on your wish list." 
                                />
                            </Center>
                        ) :
                        <>
                            {wishListItems.map((item, i) => (
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
                                            src={item.image}
                                            alt={item.name}
                                            boxSize="80px"
                                            objectFit="cover"
                                            borderRadius="md"
                                        />
                                        <Box flex={1}>
                                            <Text fontSize={['md', "lg"]} fontWeight="semibold">{capCase(item.name)}</Text>
                                            <Text color="gray.500">€ {item.price.toFixed(2)}</Text>
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
                                    >
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

                                        <Button 
                                            w="'10%'" 
                                            bg="black" 
                                            color="white" 
                                            _hover={{ bg: "gray.700" }} 
                                            // leftIcon={<FaShoppingCart />}
                                        >
                                            ADD TO CART
                                        </Button>

                                        <IconButton
                                            icon={<MdCancel />}
                                            aria-label="Remove item"
                                            variant="ghost"
                                            colorScheme="red"
                                            onClick={() => handleRemoveItem(item.id)}
                                        />
                                    </Flex>
                                </Flex>
                            ))}
                        </>}

                </Box>
        </Box>
    )
}

export default function WaitListPage() {
    return (
        <PageMainContainer title='Wishlist' description='Wishlist'>
            <MainAppLayout>
                <AnimateRoute>
                    <Container>
                        <WaitlistMain />
                    </Container>
                </AnimateRoute>
            </MainAppLayout>
        </PageMainContainer>
    )
}
