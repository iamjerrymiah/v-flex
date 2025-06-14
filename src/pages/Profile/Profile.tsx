import AnimateRoute from "../../common/AnimateRoute"
import PageMainContainer from "../../common/PageMain"
import MainAppLayout from "../../layouts/MainAppLayout"
import { 
    Box, Grid, GridItem, Text, Icon,
    Button,
    HStack,
    // Flex,  VStack, Stack, useBreakpointValue 
  } from "@chakra-ui/react";
import { FaClipboardList, FaBookmark, FaAddressBook, FaUser, FaUsers } from "react-icons/fa";
import { AiOutlineProduct } from "react-icons/ai";
import { TbCategoryFilled, TbShoppingCartStar } from "react-icons/tb";
import React, { useEffect } from "react";
import { useGetAuthState, useLogout } from "../../hooks/auth/AuthenticationHook";
import { useNavigate } from "react-router";
import { allCaps } from "../../utils/utils";
import { Container } from "../../styling/layout";
import { MdLogout, MdOutlineArrowBackIos } from "react-icons/md";
import Notify from "../../utils/notify";
import { BsCart } from "react-icons/bs";
import { useConfirmAction } from "../../utils/useActions";
import ConfirmModal from "../../common/ConfirmModal";
import Loader from "../../common/Loader";

// Dashboard Items
const dashboardItems = [
    { label: "ACCOUNT DETAILS", link: '/profile/account-details', description: "Update personal info", icon: FaUser },
    { label: "ADDRESS BOOK", link: '/profile/address-book', description: "Manage addresses", icon: FaAddressBook },
    { label: "MY WISHLIST", link: '/my-wishlist', description: "View & modify your wishlist", icon: FaBookmark },
    { label: "MY CART", link: '/my-cart', description: "View cart & proceed to checkout", icon: BsCart },
    { label: "MY ORDERS", link: '/profile/my-orders', description: "Check order status", icon: FaClipboardList },
//   { label: "MY RETURNS", link: '/profile/my-returns', description: "Return/exchange items", icon: FaUndo },

    { label: "CATEGORIES", link: '/vl/admin/categories', description: "View, create & delete categories", icon: TbCategoryFilled },
    { label: "PRODUCTS", link: '/vl/admin/products', description: "View, create, edit & delete products", icon: AiOutlineProduct },
    { label: "USERS", link: '/vl/admin/users', description: "View all users & disable users", icon: FaUsers },
    { label: "ORDERS", link: '/vl/admin/orders', description: "View all orders", icon: TbShoppingCartStar },
];

export function ProfileLayout({children}: {children: React.ReactNode}) {
    
    const navigate = useNavigate()
    
    // const isMobile = useBreakpointValue({ base: true, md: false });

    const { isAuthenticated, user, isLoading } =  useGetAuthState();

    useEffect(() => {
        if ( !isAuthenticated) { navigate("/") }
      }, [isAuthenticated]);
      
      if (isLoading) {
        return <Loader />;
      }

    console.log(user)

    return (
        <Box py={6}>
  
            <Text fontSize="2xl" fontWeight="bold" textAlign="center" mt={4} mb={8}>MY ACCOUNT </Text>

            <Text fontSize="md" textAlign="center" fontWeight="semibold" my={4}>
                WELCOME BACK. {allCaps(`${user?.firstName} ${user?.lastName}`)}
            </Text>

            <HStack justify={'space-between'} w={'100%'} my={4}>
                <Button
                    leftIcon={<MdOutlineArrowBackIos />}
                    variant="ghost"
                    onClick={() => navigate('/')}
                    textDecor={'underline'}
                >
                    Back
                </Button>
            </HStack>

            {/* <Flex direction={{ base: "column", md: "row" }} gap={8}>

                {isMobile ? (
                <Stack direction="row" wrap="wrap" spacing={4} justify="center">
                    <Text fontWeight="bold" fontSize="sm" cursor="pointer" _hover={{ color: "blue.500" }} onClick={() => navigate('/profile')}>
                        MY DASHBOARD
                    </Text>

                    {dashboardItems.map((item, i) => (
                    <Text 
                        key={i} 
                        fontWeight="bold" 
                        fontSize="sm"
                        cursor="pointer" 
                        _hover={{ color: "blue.500" }}
                        onClick={() => navigate(item?.link)}
                    >
                        {item?.label}
                    </Text>
                    ))}
                </Stack>
                ) : (
                <VStack align="stretch" spacing={4} w="20%" borderRight="1px solid #ccc" pr={4}>
                    <Text 
                        fontWeight="bold" 
                        cursor="pointer" 
                        _hover={{ color: "blue.500" }}
                        onClick={() => navigate("/profile")}
                    >
                        MY DASHBOARD
                    </Text>

                    {dashboardItems.map((item, i) => (
                    <Text 
                        key={i} 
                        fontWeight="bold" 
                        cursor="pointer" 
                        _hover={{ color: "blue.500" }}
                        onClick={() => navigate(item?.link)}
                    >
                        {item?.label}
                    </Text>
                    ))}
                </VStack>
                )}

                {children}

            </Flex> */}

            {children}
      </Box>
    )
}


function ProfileMain () {

    const navigate = useNavigate()
    const { openConfirm, closeConfirm, isOpenConfirm } = useConfirmAction()

    const shouldLogout = (data: any) => {
        openConfirm(data)
    }

    const { mutateAsync } = useLogout()
    const handleLogout = async (data:any) => {
        try {

            const payload: any = await mutateAsync(data);
            navigate('/')
            return payload;
        } catch (e:any) {
            Notify.error("Logged Out!")
            return e
        }
    };

    return(
        <ProfileLayout>
            <Grid 
                templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} 
                gap={6} 
                flex="1"
            >
            {dashboardItems.map(({ label, link, description, icon }) => (
                <GridItem 
                    key={label} 
                    textAlign="center" 
                    p={4} 
                    cursor={'pointer'} 
                    border="1px solid #eee" 
                    borderRadius="md"
                    _hover={{ bgColor: "#eee" }}
                    onClick={() => navigate(link)}
                >
                    <Icon as={icon} boxSize={{ base: 6, md: 8 }} mb={2} />
                    <Text fontWeight="bold">{label}</Text>
                    <Text fontSize="sm" color="gray.600">{description}</Text>
                </GridItem>
            ))}

            <GridItem 
                textAlign="center" 
                p={4} 
                cursor={'pointer'} 
                border="1px solid red" 
                borderRadius="md"
                _hover={{ bgColor: "red.300", color: 'white' }}
                bgColor={'red.200'}
                onClick={() => shouldLogout({})}
            >
                <Icon color={'red.500'} as={MdLogout} boxSize={{ base: 6, md: 8 }} mb={2} />
                <Text fontWeight="bold">{"LOG OUT"}</Text>
                <Text fontSize="sm" color="gray.600">{"Log out your account"}</Text>
            </GridItem>

            </Grid>

            <ConfirmModal
                isOpen={isOpenConfirm}
                onConfirm={handleLogout}
                onClose={closeConfirm}
                message={"Are you sure you want to log out?"}
            />
        </ProfileLayout>
    )
}

export default function ProfilePage () {
    return(
        <PageMainContainer title='Profile' description='Profile'>
            <MainAppLayout noFooter>
                <AnimateRoute>
                    <Container>
                        <ProfileMain />
                    </Container>
                </AnimateRoute>
            </MainAppLayout>
        </PageMainContainer>
    )
}
