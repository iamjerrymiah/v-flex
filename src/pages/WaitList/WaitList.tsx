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
    Tooltip,
    useDisclosure,
    Stack,
    Select,
    Input,
    Spinner,
  } from "@chakra-ui/react";
  import { useEffect, useState } from "react";
import PageSk from "../../common/PageSk";
import EmptyListHero from "../../common/EmptyListHero";
import { capCase, moneyFormat } from "../../utils/utils";
import { MdCancel, MdOutlineArrowBackIos } from "react-icons/md";
import { useAddProductToCart, useDeleteWishlistProduct, useGetUserCarts, useGetUserWishlists } from "../../hooks/user/users";
import { useNavigate } from "react-router";
import { useGetAuthState } from "../../hooks/auth/AuthenticationHook";
import Notify from "../../utils/notify";
import ModalCenter from "../../common/ModalCenter";
import { BsClipboard2CheckFill, BsClipboardXFill } from "react-icons/bs";
import Loader from "../../common/Loader";


function WaitlistMain ({ wishLists = [], carts = {}, user = {}, isLoading, isAuthenticated }: any) {

    const navigate = useNavigate()

    // const [wishListItems, setWishlistItems] = useState<any[]>(wishLists);
    const [selected, setSelected] = useState<any>({})

    const [selectedColor, setSelectedColor] = useState<string>("");
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [quantity, setQuantity] = useState<any>(1);
    
    const {isOpen, onOpen, onClose } = useDisclosure()

    const onSelected = (d:any) => {
        setSelected(d)
        onOpen()
    }

    const closed = () => {
        setSelected({})
        onClose()
    }

    const { mutateAsync: addCartAction, isPending: cartPend } = useAddProductToCart()
    const { mutateAsync: removeWishlistAction, isPending } = useDeleteWishlistProduct()

    const handleAddCart = async (data:any) => {
        try {
            const res:any =  await addCartAction({
                product: data?._id,
                size: selectedSize ?? data?.sizes[0],
                color: selectedColor ?? data?.colors[0],
                quantity: quantity ?? 1
            })
            Notify.success("Product added to cart successfully.")
            closed()
            return res;
        } catch(e:any) {
            Notify.error(e?.message ?? "Failed")
            return e
        }
    }

    const handleRemoveItem = async (id: string) => {
        try { 
            const res:any = await removeWishlistAction({ productId: id }); 
            // setWishlistItems((prev) => prev?.filter((item) => item._id !== id)); 
            return res 
        } catch(e:any) {return e}
    };

    return (
        <Box py={6}>

            {isPending ?
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

            <Heading textAlign="center" fontSize={["24px", '30px']} fontWeight={400} mb={10}> MY WISHLIST </Heading>

                <Button
                    leftIcon={<MdOutlineArrowBackIos />}
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    my={4}
                    textDecor={'underline'}
                >
                    Back
                </Button>

                <Box flex={3} borderRadius="xl">
                        {isLoading ? (
                            <>
                                <PageSk tiny/>
                            </>
                        ) :
                         wishLists?.length <= 0 ? (
                            <Center mt={[4, 10]}>
                                <EmptyListHero
                                    w="400px"
                                    text={isAuthenticated ? "You have no items on your wish list." : "You need to log in to access your wish list!" }
                                />
                            </Center>
                        ) :
                        <>
                            {wishLists?.map((item:any, i:any) => (
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
                                    <HStack w={['100%']} spacing={2} mr={2}>
                                        <Image
                                            src={item?.mainImage}
                                            alt={item?.name}
                                            boxSize="80px"
                                            objectFit="cover"
                                            borderRadius="md"
                                            cursor={'pointer'}
                                            onClick={() => navigate(`/products/${item?.slug}?componentsVfproduct=${item?._id}`)}
                                        />
                                        <Box flex={1}>
                                            <Text 
                                                fontSize={['md', "lg"]} 
                                                fontWeight="semibold"
                                                cursor={'pointer'}
                                                _hover={{ color: 'gray' }}
                                                onClick={() => navigate(`/products/${item?.slug}?componentsVfproduct=${item?._id}`)}
                                            >
                                                {capCase(item?.name)}
                                            </Text>
                                            <HStack><Text color="gray.500">{item?.availability == true ? "Available" : "Out of Stock"}</Text> <Text>{item?.availability == true ? <BsClipboard2CheckFill color="green" size={20}/> : <BsClipboardXFill color="red" size={20}/>}</Text></HStack>
                                        </Box>
                                    </HStack>

                                    <Flex
                                        direction={{ base: "row", sm: "row" }}
                                        align="center"
                                        gap={3}
                                        w="full"
                                        justify="space-between"
                                        pt={[0,4]}
                                    >
                                        <HStack>
                                            <Text color="gray.800">Price: <Text color={'black'} fontWeight={500} fontSize={['16px', '20px']}>€ {moneyFormat(item.price)}</Text> </Text>
                                        </HStack>

                                        <Tooltip 
                                            bgColor={'red.500'}
                                            label={!isAuthenticated 
                                            ? "Please log in to add to cart." : !user?.emailVerified ? "Please verify your account"
                                            : carts?.cart?.length >= 1000 ? "You've reached the limit amount in cart." : ""}
                                        >
                                            <Button 
                                                bg="black" 
                                                color="white" 
                                                _hover={{ bg: "gray.700" }} 
                                                isDisabled={!isAuthenticated || !user?.emailVerified || carts?.cart?.length >= 1000}
                                                isLoading={cartPend}
                                                onClick={() => { onSelected(item) }}
                                            >
                                                ADD TO CART
                                            </Button>
                                        </Tooltip>

                                        <IconButton
                                            icon={<MdCancel />}
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

            <ModalCenter 
                isOpen={isOpen}
                onClose={onClose}
                header='Add To Cart'
                body={
                    <form onSubmit={(e) => { e?.preventDefault(); handleAddCart(selected); }}>
                        <Stack spacing={4}>
                            <HStack>
                                <Text w={'13%'}>Size:</Text>
                                <Select mb={4} value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} required>
                                    <option value={""}>{"Select Size"}</option>
                                    {selected?.sizes?.map((size:any, index:any) => (
                                        <option key={index} value={size}>{size}</option>
                                    ))}
                                </Select>
                            </HStack>
                            <HStack>
                                <Text w={'13%'}>Color:</Text>
                                <Select mb={4} value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} required>
                                    <option value={""}>{"Select Color"}</option>
                                    {selected?.colors?.map((size:any, index:any) => (
                                        <option key={index} value={size}>{size}</option>
                                    ))}
                                </Select>
                            </HStack>

                            <HStack>
                                <Text>Quantity:</Text>
                                <Input type="number" value={quantity} placeholder={"Quantity"} onChange={ (e) => setQuantity(e.target.value) } required/>
                            </HStack>

                            <HStack w={'full'} justify={'space-between'} spacing={3} mt={6}>
                                <Button 
                                    w={'100%'} 
                                    bg="gray" 
                                    onClick={closed}
                                > 
                                    Back 
                                </Button>
                                <Button 
                                    w={'100%'}
                                    bg="blue.700" 
                                    type='submit'
                                    color="white" 
                                    isDisabled={cartPend || selectedColor == "" || selectedSize == ""}
                                    isLoading={cartPend}
                                >
                                    Save
                                </Button>
                                
                            </HStack>
                        </Stack>
                    </form>
                }
            />

        </Box>
    )
}

export default function WaitListPage() {

    const navigate = useNavigate()
    const { data: wishListData = {}, isLoading: wishLoad } = useGetUserWishlists({})
    const { data: wishLists = [] } = wishListData

    const { data: cartData = {} } = useGetUserCarts({})
    const { data: carts = {} } = cartData

    const { isLoading, isAuthenticated, user } = useGetAuthState()
    useEffect(() => { if(!isLoading && isAuthenticated == false) { navigate('/products/vl') } }, [isLoading, isAuthenticated])
    if(isLoading) { return (<Loader />) }

    return (
        <PageMainContainer title='Wishlist' description='Wishlist'>
            <MainAppLayout noFooter>
                <AnimateRoute>
                    <Container>
                        <WaitlistMain 
                            isLoading={wishLoad}
                            wishLists={wishLists ?? []}
                            user={user}
                            carts={carts}
                            isAuthenticated={isAuthenticated}
                        />
                    </Container>
                </AnimateRoute>
            </MainAppLayout>
        </PageMainContainer>
    )
}
