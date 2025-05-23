import React, { useCallback, useState } from "react";
import { Box, Button, HStack, Input, SimpleGrid, Stack, Tooltip, useDisclosure } from "@chakra-ui/react";
import { FaRegUser } from "react-icons/fa";
import { IoIosStarOutline, IoMdMenu } from 'react-icons/io'
import { BsCart, BsSearch } from "react-icons/bs";
import Drawer from "../../../common/Drawer";
import { useNavigate } from "react-router";
import Sidebar from "./sidebar";
import { useGetAuthState } from "../../../hooks/auth/AuthenticationHook";
import { capCase, formatNumberToShortForm } from "../../../utils/utils";
import { useProductFilter } from "../../../providers/ProductFilterProvider";
import { MdLockReset } from "react-icons/md";
import queryString from "query-string";
import { useGetProductCollections } from "../../../hooks/products/collections";
import { useGetUserCarts, useGetUserWishlists } from "../../../hooks/user/users";
import { TbWorldSearch } from "react-icons/tb";

export function IconIndicator (props:any) {
    return (
      <Box position="relative" cursor="pointer" onClick={props?.onClick}>
        {props.children}
        {props?.count > 0 && (
          <Box
            position="absolute"
            top="-3"
            right="-3"
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


export default function HeaderRight({mobile}: {mobile?:boolean}) {

    const navigate = useNavigate();  
    const { isOpen, onToggle, onClose } = useDisclosure()

    const { isAuthenticated, user } =  useGetAuthState();

    const { data: collectionData = {} } = useGetProductCollections({})
    const { data: wishListData = {} } = useGetUserWishlists({})
    const { data: cartData = {} } = useGetUserCarts({})

    const { data: carts = {} } = cartData
    const { data: wishLists = [] } = wishListData
    const { data: categories = [] } = collectionData

    const { isOpenSearch, openSearch, closeSearch } = useProductFilter()

    const [search, setSearch] = useState<any>({
        minPrice: 0,
        maxPrice: 1000000000000000
    });

    const onFilter = useCallback(() => {
        let queries = queryString.stringify({...search});
        closeSearch()
        navigate(`/products/vl?${queries}`)
    }, [search])

    return (
        <React.Fragment>
            <HStack spacing={4} justify={'flex-end'} ml={'50px'}>
                <Tooltip label={'Search'}>
                    <TbWorldSearch 
                        size={28} 
                        cursor={'pointer'}
                        onClick={openSearch}
                        color="#00008B"
                    />
                </Tooltip> 

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
                                    size={24} 
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
                                    size={20} 
                                    cursor={'pointer'}
                                />
                            </Tooltip>
                        </IconIndicator>
                        <Tooltip label={isAuthenticated ? capCase(`${user?.firstName} ${user?.lastName}`) : 'Sign In'}>
                            <FaRegUser 
                                size={20} 
                                onClick={() => navigate(isAuthenticated ? '/profile' : '/login')} 
                                cursor={'pointer'}
                            />
                        </Tooltip>
                    </HStack> 
                }

                {/* {isAuthenticated && <Button bg={'red.700'} fontSize={'10px'} color={'white'} isLoading={isPending} onClick={handleLogout}>Logout</Button>} */}

                {categories?.length > 0 ?
                    <IoMdMenu 
                        cursor={'pointer'} 
                        onClick={onToggle} 
                        size={30} 
                        style={{ marginLeft: '10px' }}
                    />
                : null}

            </HStack>

            <Drawer 
                size={mobile ? '500px': '850px'}
                isOpen={isOpen}
                onClose={onClose}
                body={
                    <Sidebar 
                        isOpen={isOpen}
                        onClose={onClose}
                    />
                }
            />
            <Drawer 
                placement={'top'}
                isOpen={isOpenSearch}
                onClose={closeSearch}
                header="Search Product: "
                body={
                    <Stack w='100%'>
                        <SimpleGrid columns={[1,2,4]} spacing={4} py={4}>
                            <Input border={'1px solid gray'} placeholder={"Search Product"} onChange={ (e) => setSearch((prev: any) => ({...prev, search: e.target.value })) }/>
                            <Input border={'1px solid gray'} type="number" placeholder={"Search Min. Price"} onChange={ (e) => setSearch((prev: any) => ({...prev, minPrice: e.target.value })) }/>
                            <Input border={'1px solid gray'} type="number" placeholder={"Search Max. Price"} onChange={ (e) => setSearch((prev: any) => ({...prev, maxPrice: e.target.value })) }/>
                        </SimpleGrid>
                    </Stack>

                }
                footer={
                    <HStack w={'100%'} justify={'flex-end'} spacing={2}>
                        <Button leftIcon={<MdLockReset />} onClick={ () => { closeSearch();} } />
                        <Button leftIcon={<BsSearch />} color={'white'} bgColor={'blackAlpha.800'} onClick={onFilter} />
                    </HStack>
                }
            />

        </React.Fragment>
    )
}
