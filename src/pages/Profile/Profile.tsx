import AnimateRoute from "../../common/AnimateRoute"
import PageMainContainer from "../../common/PageMain"
import MainAppLayout from "../../layouts/MainAppLayout"
import { 
    Box, Flex, Grid, GridItem, Text, VStack, Icon, Stack, useBreakpointValue 
  } from "@chakra-ui/react";
import { FaClipboardList, FaBookmark, FaAddressBook, FaUser, FaUsers } from "react-icons/fa";
import { AiOutlineProduct } from "react-icons/ai";
import { TbCategoryFilled, TbShoppingCartStar } from "react-icons/tb";
import React, { useEffect } from "react";
import { useGetAuthState } from "../../hooks/auth/AuthenticationHook";
import { useNavigate } from "react-router";
import { allCaps } from "../../utils/utils";
import { Container } from "../../styling/layout";

// Dashboard Items
const dashboardItems = [
    { label: "ACCOUNT DETAILS", link: '/profile/account-details', description: "Update personal info", icon: FaUser },
    { label: "ADDRESS BOOK", link: '/profile/address-book', description: "Manage addresses", icon: FaAddressBook },
    { label: "MY WISHLIST", link: '/my-wishlist', description: "View & modify wishlist", icon: FaBookmark },
    { label: "MY ORDERS", link: '/profile/my-orders', description: "Check order status", icon: FaClipboardList },
//   { label: "MY RETURNS", link: '/profile/my-returns', description: "Return/exchange items", icon: FaUndo },

    { label: "CATEGORIES", link: '/admin/categories', description: "View, create, edit & delete categories", icon: TbCategoryFilled },
    { label: "PRODUCTS", link: '/admin/products', description: "View, create, edit & delete products", icon: AiOutlineProduct },
    { label: "USERS", link: '/admin/users', description: "View all users & disable users", icon: FaUsers },
    { label: "ORDERS", link: '/admin/orders', description: "View all orders", icon: TbShoppingCartStar },
];

export function ProfileLayout({children}: {children: React.ReactNode}) {
    
    const navigate = useNavigate()
    
    const isMobile = useBreakpointValue({ base: true, md: false });

    const { isAuthenticated, user } =  useGetAuthState();

    useEffect(() => { 
        if(!isAuthenticated) {
            navigate(-1)
        } 
    }, [isAuthenticated])

    return (
        <Box >
  
            <Text fontSize="2xl" fontWeight="bold" textAlign="center" mt={4} mb={8}>MY ACCOUNT </Text>

            <Text fontSize="md" textAlign="center" fontWeight="semibold" my={4}>
                WELCOME BACK. {allCaps(user?.fullName ?? "")}
            </Text>

            <Flex direction={{ base: "column", md: "row" }} gap={8}>
                {/* Sidebar */}
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

            </Flex>
      </Box>
    )
}


function ProfileMain () {

    const navigate = useNavigate()

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
            </Grid>
        </ProfileLayout>
    )
}

export default function ProfilePage () {
    return(
        <PageMainContainer title='Profile' description='Profile'>
            <MainAppLayout>
                <AnimateRoute>
                    <Container>
                        <ProfileMain />
                    </Container>
                </AnimateRoute>
            </MainAppLayout>
        </PageMainContainer>
    )
}
