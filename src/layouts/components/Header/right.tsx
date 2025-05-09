import React from "react";
import { Box, HStack, Tooltip, useDisclosure } from "@chakra-ui/react";
import { FaRegUser } from "react-icons/fa";
import { IoIosStarOutline, IoMdMenu } from 'react-icons/io'
import { BsCart, BsSearch } from "react-icons/bs";
import Drawer from "../../../common/Drawer";
import { useNavigate } from "react-router";
import Sidebar from "./sidebar";
import { useGetAuthState } from "../../../hooks/auth/AuthenticationHook";
import { capCase } from "../../../utils/utils";
// import Notify from "../../../utils/notify";


export default function HeaderRight({mobile}: {mobile?:boolean}) {

    const navigate = useNavigate();  
    const { isOpen, onToggle, onClose } = useDisclosure()
    const { isOpen: isOpenSearch, onToggle: onToggleSearch, onClose: onCloseSearch } = useDisclosure()

    const { isAuthenticated, user } =  useGetAuthState();

    // const { mutateAsync, isPending } = useLogout()

    // const handleLogout = async (data:any) => {
    //     try {

    //         const payload: any = await mutateAsync(data);

    //         return payload;
    //     } catch (e:any) {
    //         Notify.error("Logged Out!")
    //         return e
    //     }
    // };

    return (
        <React.Fragment>
            <HStack spacing={4} justify={'flex-end'}>
                <Tooltip label={'Search'}>
                    <BsSearch 
                        size={20} 
                        cursor={'pointer'}
                        onClick={onToggleSearch}
                    />
                </Tooltip>
                <Tooltip label={'My Wishlist'}>
                    <IoIosStarOutline 
                        size={20} 
                        onClick={() => navigate('/my-wishlist')} 
                        cursor={'pointer'}
                    />
                </Tooltip>
                <Tooltip label={'Shopping Bag'}>
                    <BsCart 
                        size={20} 
                        onClick={() => navigate('/my-cart')} 
                        cursor={'pointer'}
                    />
                </Tooltip>
                <Tooltip label={isAuthenticated ? capCase(`${user?.firstName} ${user?.lastName}`) : 'Sign In'}>
                    <FaRegUser 
                        size={20} 
                        onClick={() => navigate(isAuthenticated ? '/profile' : '/login')} 
                        cursor={'pointer'}
                    />
                </Tooltip>

                {/* {isAuthenticated && <Button bg={'red.700'} fontSize={'10px'} color={'white'} isLoading={isPending} onClick={handleLogout}>Logout</Button>} */}

                <IoMdMenu 
                    cursor={'pointer'} 
                    onClick={onToggle} 
                    size={30} 
                    style={{ marginLeft: '10px' }}
                />
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
                placement='top'
                size={mobile ? '1500px': '1850px'}
                isOpen={isOpenSearch}
                onClose={onCloseSearch}
                body={
                    <Box my={'100px'}>

                    </Box>
                }
            />

        </React.Fragment>
    )
}
