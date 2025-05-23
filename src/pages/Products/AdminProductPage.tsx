import { useNavigate } from "react-router";
import AnimateRoute from "../../common/AnimateRoute";
import PageMainContainer from "../../common/PageMain";
import MainAppLayout from "../../layouts/MainAppLayout";
import { Container } from "../../styling/layout";
import { useCallback } from "react";
import { Box, Button, Heading, HStack, Input, Select, SimpleGrid, Stack, useDisclosure } from "@chakra-ui/react";
import { MdAddToPhotos, MdLockReset, MdOutlineArrowBackIos, MdOutlineProductionQuantityLimits } from "react-icons/md";
import { Table, TableRow } from "../../common/Table/Table";
import { useGetProducts } from "../../hooks/products/products";
import { capCase, moneyFormat } from "../../utils/utils";
import Pagination from "../../common/Pagination/Pagination";
import { useState } from "react";
import { BsFilter, BsSearch } from "react-icons/bs";
import Drawer from "../../common/Drawer";
import { useGetProductCollections } from "../../hooks/products/collections";
import DataInfo from "../../common/DataInfo";


const tableHeads = ["S/N", "Name", "Price", "Quantity", "Is Available", ""]

function AdminProductMain ({ products = [], isLoading = false, init, filters, search, setFilters, setSearch, categories }:any) {

    const navigate = useNavigate()
    // const { isAuthenticated } =  useGetAuthState();
    
    const { isOpen: isOpenFilter, onOpen: onOpenFilter, onClose: onCloseFilter } = useDisclosure()

    // useEffect(() => { 
    //     if(!isAuthenticated) {
    //         navigate(-1)
    //     } 
    // }, [isAuthenticated])

    const onFilter = () => {
        setFilters({ ...filters, ...search, categoryId: category?._id });
        onCloseFilter()
        setSearch((prev: any) => ({...prev, search: "", category: "", minPrice: 0, maxPrice: 1000000000000000 }))
    }

    const changePage = ({ selected = 0 }) => {
        setFilters({ ...filters, page: selected + 1 });
    }

    const categoryByName = useCallback((slug:any) => categories?.find((e:any) => e?.slug === slug) ?? false, [categories])
    const category: any = categoryByName(search?.category)

    const dataInformationArray = [
        {title: 'Total Products', value: init?.totalProducts ?? "-", iconColor: 'black', icon: MdOutlineProductionQuantityLimits},
        {title: 'Total Available Products', value: init?.availableProducts ?? "-", iconColor: 'green', icon: MdOutlineProductionQuantityLimits},
        {title: 'Total Disabled Products', value: init?.deactivatedProducts ?? "-", iconColor: 'red', icon: MdOutlineProductionQuantityLimits},
        {title: 'Total Product Sales', value: init?.totalSales ?? "-", iconColor: 'brown', icon: MdOutlineProductionQuantityLimits},
    ]

    return (
        <Box py={6}>

            <Heading textAlign="center" fontSize={["24px", '30px']} fontWeight={400} my={6}> PRODUCTS </Heading>

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

            <HStack justify={'space-between'} w={'100%'} my={4}>
                <Button
                    leftIcon={<MdOutlineArrowBackIos />}
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    textDecor={'underline'}
                >
                    Back
                </Button>

                <HStack spacing={2}>
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

            <Table
                headings={tableHeads}
                loading={isLoading}
                isEmpty={products?.length <= 0}
                emptyText='No product found'
                pt={3}
                noIndexPad
            >
                {products?.map((item:any, index:any) =>
                    <TableRow
                        key={index}
                        data={[
                            (index + 1 ),
                            capCase(item?.name ?? "-"),
                            `€ ${moneyFormat(item?.price ?? 0)}`,
                            item?.quantity ?? "-",
                            item?.availability == true ? "Yes" : "No",
                        ]}
                        noIndexPad
                        options={[
                            {name: "View", onUse: () => navigate(`/admin/products/${item?._id}`)},
                            {name: "Delete", color: 'red.700', onUse: () => {}},
                        ]}
                    />
                )}
            </Table>

            <Pagination
                pageCount={init?.totalPages}
                onPageChange={changePage}
            />

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
                            <Select placeholder="Search Category" onChange={ (e) => setSearch((prev: any) => ({...prev, category: e.target.value })) }>
                                {categories?.map((c:any, i:any) => ( <option key={i} value={c?.slug}>{capCase(c?.slug)} </option> ))}
                            </Select>
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

export default function AdminProductPage() {

    const { data: collectionData = {} } = useGetProductCollections({})
    const { data: categories = [] } = collectionData

    const [search, setSearch] = useState<any>({
        minPrice: 0,
        maxPrice: 1000000000000000
    });
    
    const [filters, setFilters] = useState({} as any)
    
    const { data: productData = {}, isLoading } = useGetProducts(filters)
    const { data: products = {} } = productData

    return (
        <PageMainContainer title='Products' description='Products'>
            <MainAppLayout noFooter>
                <Container>
                    <AnimateRoute>
                        <AdminProductMain 
                            isLoading={isLoading}
                            products={products?.products}
                            init={products}
                            filters={filters}
                            search={search}
                            setFilters={setFilters}
                            setSearch={setSearch}
                            categories={categories}
                        />
                    </AnimateRoute>
                </Container>
            </MainAppLayout>
        </PageMainContainer>
    )
}
