import AnimateRoute from "../../common/AnimateRoute"
import PageMainContainer from "../../common/PageMain"
import MainAppLayout from "../../layouts/MainAppLayout"
import { 
    Box, Grid, GridItem, Text, Icon,
    Button,
    HStack,
  } from "@chakra-ui/react";
import { FaClipboardList, FaBookmark, FaAddressBook, FaUser, FaUsers } from "react-icons/fa";
import { AiOutlineProduct } from "react-icons/ai";
import { TbCategoryFilled, TbShoppingCartStar, TbPasswordUser } from "react-icons/tb";
import React, { useEffect } from "react";
import { useGetAuthState, useLogout } from "../../hooks/auth/AuthenticationHook";
import { useNavigate } from "react-router";
import { allCaps, isSuperUser } from "../../utils/utils";
import { Container } from "../../styling/layout";
import { MdLogout, MdOutlineArrowBackIos, MdOutlinePayments } from "react-icons/md";
import Notify from "../../utils/notify";
import { BsCart } from "react-icons/bs";
import { useConfirmAction } from "../../utils/useActions";
import ConfirmModal from "../../common/ConfirmModal";
import Loader from "../../common/Loader";
import { MotionAnimator } from "../../common/MotionAnimator";

export function ProfileLayout({children, user = {}}: {children: React.ReactNode; user:any}) {
    
    const navigate = useNavigate()

    return (
        <MotionAnimator direction="left" delay={0.6}>
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

                {children}
            </Box>
    </MotionAnimator>
    )
}


function ProfileMain () {

    const navigate = useNavigate()
    const { openConfirm, closeConfirm, isOpenConfirm } = useConfirmAction()

    const { isAuthenticated, user, isLoading } =  useGetAuthState();

    const shouldLogout = (data: any) => {
        openConfirm(data)
    }

    const { mutateAsync } = useLogout()
    const handleLogout = async (data:any) => {
        try {
            const payload: any = await mutateAsync(data);
            navigate('/products/vl')
            return payload;
        } catch (e:any) {
            Notify.error("Logged Out!")
            navigate('/products/vl')
            return e
        }
    };

    const isAdmin = isSuperUser(user?.role)
    const dashboardItems = [
        { label: "ACCOUNT DETAILS", link: '/profile/account-details', description: "Update personal info", icon: FaUser, show: true },
        { label: "ADDRESS BOOK", link: '/profile/address-book', description: "Manage addresses", icon: FaAddressBook, show: true },
        { label: "MY WISHLIST", link: '/my-wishlist', description: "View & modify your wishlist", icon: FaBookmark, show: true },
        { label: "MY CART", link: '/my-cart', description: "View cart & proceed to checkout", icon: BsCart, show: true },
        { label: "MY ORDERS", link: '/profile/my-orders', description: "Check order status", icon: FaClipboardList, show: true },

        { label: "CATEGORIES", link: '/vl/admin/categories', description: "View, create & delete categories", icon: TbCategoryFilled, show: isAdmin ? true : false },
        { label: "PRODUCTS", link: '/vl/admin/products', description: "View, create, edit & delete products", icon: AiOutlineProduct, show: isAdmin ? true : false },
        { label: "USERS", link: '/vl/admin/users', description: "View all users & disable users", icon: FaUsers, show: isAdmin ? true : false },
        { label: "ORDERS", link: '/vl/admin/orders', description: "View all orders", icon: TbShoppingCartStar, show: isAdmin ? true : false },
        { label: "PAYMENTS", link: '/vl/admin/payments', description: "View all payments", icon: MdOutlinePayments, show: isAdmin ? true : false },
        
        { label: "CHANGE PASSWORD", link: '/profile/change-password', description: "Change your password", icon: TbPasswordUser, show: true },
    ];

    useEffect(() => { if(!isLoading && isAuthenticated == false) { navigate('/products/vl') } }, [isLoading, isAuthenticated])
    if(isLoading) { return (<Loader />) }

    return(
        <ProfileLayout user={user}>
            <Grid 
                templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} 
                gap={6} 
                flex="1"
            >
            {dashboardItems?.map(({ label, link, description, icon, show }) => (
                <GridItem 
                    key={label} 
                    textAlign="center" 
                    p={4} 
                    cursor={'pointer'} 
                    border="1px solid #eee" 
                    borderRadius="md"
                    _hover={{ bgColor: "#eee" }}
                    onClick={() => navigate(link)}
                    display={show === true ? 'block' : 'none'}
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
