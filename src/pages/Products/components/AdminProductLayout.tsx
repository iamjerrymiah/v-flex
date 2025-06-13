import { Box, Button, Flex, Heading, HStack, Input, SimpleGrid, Stack, useDisclosure } from "@chakra-ui/react";
import { useCategoryContext } from "../../../providers/CategoryContext";
import { useCallback, useState } from "react";
import TopNav from "./TopNav";
import SideNav from "./SideNav";
import { MdAddToPhotos, MdLockReset, MdOutlineArrowBackIos, MdOutlineProductionQuantityLimits } from "react-icons/md";
import DataInfo from "../../../common/DataInfo";
import { useNavigate } from "react-router";
import { BsFilter, BsSearch } from "react-icons/bs";
import { capCase } from "../../../utils/utils";
import Drawer from "../../../common/Drawer";

function AdminSubNav () {

    const { topCategory, setSubCategory } = useCategoryContext();

    if (!topCategory) return null;
    
    return (
            <Box w='100%' mb={4} borderBottom={'1px solid'}>
                <HStack overflowX={'scroll'} className='scroll-custom'>
                    {topCategory.subcategories?.map((sub:any) => (
                        <Box>
                            <Button 
                                variant="ghost" 
                                onClick={() => setSubCategory(sub)}
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
    // const { isAuthenticated } =  useGetAuthState();
    
    const { isOpen: isOpenFilter, onOpen: onOpenFilter, onClose: onCloseFilter } = useDisclosure()

    const dataInformationArray = [
        {title: 'Total Products', value: init?.totalProducts ?? "-", iconColor: 'black', icon: MdOutlineProductionQuantityLimits},
        {title: 'Total Available Products', value: init?.availableProducts ?? "-", iconColor: 'green', icon: MdOutlineProductionQuantityLimits},
        {title: 'Total Disabled Products', value: init?.deactivatedProducts ?? "-", iconColor: 'red', icon: MdOutlineProductionQuantityLimits},
        {title: 'Total Product Sales', value: init?.totalSales ?? "-", iconColor: 'brown', icon: MdOutlineProductionQuantityLimits},
    ]

    const { subCategory } = useCategoryContext();
    const [isOpen, setIsOpen] = useState(true);

    const onFilter = () => {
        setFilters({ ...filters, ...search, categoryId: category?._id });
        onCloseFilter()
        setSearch((prev: any) => ({...prev, search: "", category: "", minPrice: 0, maxPrice: 1000000000000000 }))
    }

    const categoryByName = useCallback((slug:any) => categories?.find((e:any) => e?.slug === slug) ?? false, [categories])
    const category: any = categoryByName(search?.category)

    return (
        <Box>
            <TopNav categories={categories} admin />
                <AdminSubNav />
    
                <HStack justify={'space-between'}>
                    
                    <HStack>
                        <Button
                            leftIcon={<MdOutlineArrowBackIos />}
                            variant="ghost"
                            onClick={() => navigate(-1)}
                            textDecor={'underline'}
                        >
                            Back
                        </Button>
                        {/* {subCategory && <Breadcrumbs /> } */}
                    </HStack>

                    <Heading textAlign="center" fontSize={["24px", '30px']} fontWeight={400} my={6}> PRODUCTS </Heading>

                    <HStack>
                        {subCategory &&
                            <Button
                                // rightIcon={isOpen ? <TiChevronLeftOutline /> : <TiChevronRightOutline/>}
                                onClick={() => setIsOpen(!isOpen)}
                                transition="left 0.3s ease"
                                color={'white'}
                                bgColor={'blackAlpha.600'}
                                size={'md'}
                                textAlign={'center'}
                                display={subCategory.subcategories?.length > 0 ? 'block' : 'none'}
                            >
                                {isOpen ? 'Hide' : 'Show'}
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
                            bgColor={'blue.700'}
                        >
                            Add
                        </Button>
                    </HStack>
                </HStack>

            
            <Box
                overflowX="scroll"
                px={[5, 0]}
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

            <Flex>
                <SideNav isOpen={isOpen} setIsOpen={setIsOpen}/> 
    
                {/* Main Content */}
                <Box flex="1" p={2} transition="margin-left 0.3s ease">
                    {children}
                </Box>
            </Flex>

            <Drawer 
                placement={'top'}
                isOpen={isOpenFilter}
                onClose={onCloseFilter}
                header="Filter: "
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
                        <Button leftIcon={<MdLockReset />} onClick={ () => { setFilters({}); onCloseFilter();} } />
                        <Button leftIcon={<BsSearch />} color={'white'} bgColor={'blackAlpha.800'} onClick={onFilter} />
                    </HStack>
                }
            />

        </Box>
    )
}
