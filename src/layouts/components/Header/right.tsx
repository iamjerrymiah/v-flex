import React from "react";
import { Box, Button, HStack, Tooltip } from "@chakra-ui/react";
import { FaRegUser } from "react-icons/fa";
import { IoIosStarOutline } from 'react-icons/io'
import { BsCart } from "react-icons/bs";
import { useNavigate } from "react-router";
import { useGetAuthState } from "../../../hooks/auth/AuthenticationHook";
import { capCase, formatNumberToShortForm } from "../../../utils/utils";
import { useGetUserCarts, useGetUserWishlists } from "../../../hooks/user/users";

export function IconIndicator (props:any) {
    return (
      <Box position="relative" cursor="pointer" onClick={props?.onClick}>
        {props.children}
        {props?.count > 0 && (
          <Box
            position="absolute"
            top="-2"
            right="-2"
            p={1}
            px={props?.count < 10 ? 2 : ""}
            backgroundColor="green.400"
            color="white"
            fontSize="xs"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex="1"
          >
            {formatNumberToShortForm(props?.count)}
          </Box>
        )}
      </Box>
    )
}


export default function HeaderRight({}: {mobile?:boolean}) {

    const navigate = useNavigate();  

    const { isAuthenticated, user } =  useGetAuthState();

    const { data: wishListData = {} } = useGetUserWishlists({})
    const { data: cartData = {} } = useGetUserCarts({})

    const { data: carts = {} } = cartData
    const { data: wishLists = [] } = wishListData

    // const onFilter = useCallback(() => {
    //     let queries = queryString.stringify({...search});
    //     closeSearch()
    //     navigate(`/products/vl?${queries}`)
    // }, [search])

    return (
        <React.Fragment>
            <HStack spacing={4} justify={'flex-end'} ml={'50px'}>

                {!isAuthenticated ? 
                    <HStack spacing={4}>
                        <Button 
                            bg="green.800" 
                            color="white" 
                            _hover={{ bg: "gray.700" }} 
                            onClick={() => { navigate(`/login`) }}
                        >
                            Sign In
                        </Button>
                    </HStack> 
                    :
                    <HStack spacing={4}>
                        <IconIndicator
                            count={wishLists?.length ?? 0}
                            onClick={() => navigate('/my-wishlist')} 
                        >
                            <Tooltip label={'My Wishlist'}>
                                <IoIosStarOutline 
                                    size={28} 
                                    cursor={'pointer'}
                                />
                            </Tooltip>
                        </IconIndicator>

                        <IconIndicator
                            count={carts?.cart?.length ?? 0}
                            onClick={() => navigate('/my-cart')}
                        >
                            <Tooltip label={'Shopping Bag'}>
                                <BsCart 
                                    size={28} 
                                    cursor={'pointer'}
                                />
                            </Tooltip>
                        </IconIndicator>
                        <Tooltip label={isAuthenticated ? capCase(`${user?.firstName} ${user?.lastName}`) : 'Sign In'}>
                            <FaRegUser 
                                size={28} 
                                onClick={() => navigate(isAuthenticated ? '/profile' : '/login')} 
                                cursor={'pointer'}
                            />
                        </Tooltip>
                    </HStack> 
                }

            </HStack>

        </React.Fragment>
    )
}
