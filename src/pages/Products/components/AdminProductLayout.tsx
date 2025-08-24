import { Box, Button, Flex, Heading, HStack, SimpleGrid, Stack, Tooltip, useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import { useCategoryContext } from "../../../providers/CategoryContext";
import { useState } from "react";
import TopNav from "./TopNav";
import SideNav from "./SideNav";
import { MdAddToPhotos, MdLockReset, MdOutlineArrowBackIos, MdOutlineProductionQuantityLimits } from "react-icons/md";
import DataInfo from "../../../common/DataInfo";
import { useNavigate } from "react-router";
import { BsFilter, BsSearch } from "react-icons/bs";
import { capCase } from "../../../utils/utils";
import Drawer from "../../../common/Drawer";
import { PiEyeClosedFill, PiSlideshowFill } from "react-icons/pi";
import { IoMdMenu } from "react-icons/io";
import Sidebar from "../../../layouts/components/Header/sidebar";
import { IoReloadCircle } from "react-icons/io5";
import { SecureInput } from "../../../common/SecureInput";

function AdminSubNav () {

    const { topCategory, setSubCategory, setLinkCategory } = useCategoryContext();

    if (!topCategory) return null;
    const handleSubClick = (sub:any) => {
		setSubCategory(sub)
		setLinkCategory(null)
	}
    
    return (
            <Box w='100%' mb={4} borderBottom={'1px solid #ccc'}>
                <HStack overflowX={'scroll'} className='scroll-custom'>
                    {topCategory.subcategories?.map((sub:any, i:any) => (
                        <Box key={i}>
                            <Button 
                                variant="ghost" 
                                onClick={() => handleSubClick(sub)}
                            >
                                {capCase(sub.name)}
                            </Button>
                        </Box>
                    ))}
                </HStack>
            </Box>
                            
    )
}


export default function AdminProductLayout({ children, categories, init, isLoading, filters, search, setFilters, setSearch, }:any) {

    const navigate = useNavigate()

    const isMobileTablet = useBreakpointValue({ base: true, sm: true, md: true, lg: false });
    const { isOpen: isOpenBar, onToggle, onClose: onCloseBar } = useDisclosure()
    const { isOpen: isOpenFilter, onOpen: onOpenFilter, onClose: onCloseFilter } = useDisclosure()

    const dataInformationArray = [
        {title: 'Total Products', value: init?.totalProducts ?? "-", iconColor: 'black', icon: MdOutlineProductionQuantityLimits},
        {title: 'Total Product Sales', value: init?.totalSales ?? "-", iconColor: 'brown', icon: MdOutlineProductionQuantityLimits},
        {title: 'Total Available Products', value: init?.availableProducts ?? "-", iconColor: 'green', icon: MdOutlineProductionQuantityLimits},
        {title: 'Total Disabled Products', value: init?.deactivatedProducts ?? "-", iconColor: 'red', icon: MdOutlineProductionQuantityLimits},
    ]

    const { subCategory } = useCategoryContext();
    const [isOpen, setIsOpen] = useState(true);

    const onFilter = () => {
        setFilters({ ...filters, ...search });
        onCloseFilter()
        setSearch((prev: any) => ({
            ...prev, 
            search: "", 
            category: "" 
        }))
    }

    const resetFilter = () => {
        setFilters({disabled: "all", sortBy: 'recent'})
    }

    // const categoryByName = useCallback((slug:any) => categories?.find((e:any) => e?.slug === slug) ?? false, [categories])
    // const category: any = categoryByName(search?.category)

    return (
        <Box>
            {!isMobileTablet && 
                <TopNav 
                    admin 
                    categories={categories} 
                    filter={filters}
                    search={search}
                    setSearch={setSearch}
                    setFilter={setFilters} 
                />
            }
            {!isMobileTablet && <AdminSubNav /> }
            <Heading textAlign="center" fontSize={["24px", '30px']} fontWeight={400} pt={isMobileTablet ? 8 : 0} my={6}> PRODUCTS </Heading>

            <HStack my={3} justify={'space-between'}>
                <Button
                    leftIcon={<MdOutlineArrowBackIos />}
                    variant="ghost"
                    onClick={() => navigate(`/profile`)}
                    textDecor={'underline'}
                >
                    Back
                </Button>
                {categories?.length > 0 && isMobileTablet &&
                    <IoMdMenu 
                        cursor={'pointer'} 
                        onClick={onToggle} 
                        size={30} 
                    />
                }
            </HStack>

            <Box
                overflowX="scroll"
                px={[5, 0]}
                mb={4}
                css={{
                    scrollbarWidth: "none",
                    "-ms-overflow-style": "none",
                    "&::-webkit-scrollbar": {
                    display: "none", 
                    },
                }}
            >
                <HStack spacing={5} w="max-content">
                    {dataInformationArray?.map(( info:any, index:any ) => (
                        <DataInfo
                            key={index} 
                            isLoading={isLoading}
                            Icon={info.icon}
                            title={info.title}
                            value={info.value}
                            iconColor={info.iconColor}
                        />
                    ))}
                </HStack>
            </Box>

            <HStack justify={'flex-end'}>

                <HStack>
                    {isMobileTablet && <Tooltip label='Refresh'><IoReloadCircle size={30} cursor={'pointer'} onClick={() => resetFilter()}/></Tooltip> }

                    {subCategory && !isMobileTablet &&
                        <Button
                            leftIcon={isOpen ? <PiEyeClosedFill size={26}/>  : <PiSlideshowFill size={26}/>}
                            onClick={() => setIsOpen(!isOpen)}
                            color={'black'}
                            variant={'outline'}
                            display={subCategory.subcategories?.length > 0 ? 'block' : 'none'}
                        >
                            {/* {isOpen ? 'Hide' : 'Show'} */}
                        </Button>
                    }
                    <Button
                        leftIcon={<BsFilter size={20}/>}
                        onClick={onOpenFilter}
                        color={'white'}
                        bgColor={'blackAlpha.800'}
                    >
                        Filter
                    </Button>

                    <Button
                        leftIcon={<MdAddToPhotos />}
                        onClick={() => navigate(`/vl/admin/products/create`)}
                        color={'white'}
                        // bgColor={'blue.700'}
                        colorScheme="facebook"
                    >
                        Add
                    </Button>

                </HStack>
            </HStack>


            <Flex w='100%'>
                {!isMobileTablet && <SideNav isOpen={isOpen} setIsOpen={setIsOpen}/> }
    
                {/* Main Content */}
                <Box 
                    flex="1" 
                    p={2} 
                    overflowX={'scroll'} 
                    className="scroll-custom" 
                    transition="margin-left 0.3s ease"
                >
                    {children}
                </Box>
            </Flex>

            <Drawer 
                placement={'right'}
                size={['300px', '400px']}
                isOpen={isOpenBar}
                onClose={onCloseBar}
                body={
                    <Sidebar 
                        isOpen={isOpenBar}
                        onClose={onCloseBar}
                        setFilter={setFilters}
                    />
                }
            />

            <Drawer 
                placement={'top'}
                isOpen={isOpenFilter}
                onClose={onCloseFilter}
                header="Filter: "
                body={
                    <Stack w='100%'>
                        <SimpleGrid columns={[1,2,4]} spacing={4} py={4}>
                            <SecureInput 
                                name="search" 
                                value={search?.search} 
                                border={'1px solid gray'} 
                                placeholder={"Search Product"} 
                                onChange={ (e) => setSearch((prev: any) => ({...prev, search: e.target.value })) }
                            />
                            <SecureInput 
                                type="number" 
                                name="minPrice" 
                                value={search?.minPrice} 
                                border={'1px solid gray'} 
                                placeholder={"Search Min. Price"} 
                                onChange={ (e) => setSearch((prev: any) => ({...prev, minPrice: e.target.value })) }
                            />
                            <SecureInput 
                                type="number" 
                                name="maxPrice"
                                value={search?.maxPrice} 
                                border={'1px solid gray'} 
                                placeholder={"Search Max. Price"} 
                                onChange={ (e) => setSearch((prev: any) => ({...prev, maxPrice: e.target.value })) }
                            />
                        </SimpleGrid>
                    </Stack>

                }
                footer={
                    <HStack w={'100%'} justify={'flex-end'} spacing={2}>
                        <Button leftIcon={<MdLockReset />} onClick={ () => { resetFilter(); onCloseFilter();} } />
                        <Button leftIcon={<BsSearch />} color={'white'} bgColor={'blackAlpha.800'} onClick={onFilter} />
                    </HStack>
                }
            />

        </Box>
    )
}
