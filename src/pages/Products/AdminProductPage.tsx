import { useNavigate } from "react-router";
import AnimateRoute from "../../common/AnimateRoute";
import PageMainContainer from "../../common/PageMain";
import MainAppLayout from "../../layouts/MainAppLayout";
import { Container } from "../../styling/layout";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { Table, TableRow } from "../../common/Table/Table";
import { useGetProducts } from "../../hooks/products/products";
import { capCase, moneyFormat } from "../../utils/utils";
import Pagination from "../../common/Pagination/Pagination";
import { useState } from "react";
import { useGetProductCollections } from "../../hooks/products/collections";
import AdminProductLayout from "./components/AdminProductLayout";

export function withImg (datum:any, img:any) {
    return (
        <Flex align="center" mt="auto">
            <Avatar src={img} name={datum} size="md" />
                <Box ml={2}>
                    <Text fontWeight={500} color='#101828'>{capCase(datum)}</Text>
                </Box>
        </Flex>
    )
}


const tableHeads = ["S/N", "Product", "Price", "Quantity", "Is Available", ""]

function AdminProductMain ({ products = [], isLoading = false, init, filters, setFilters }:any) {

    const navigate = useNavigate()
    // const { isAuthenticated } =  useGetAuthState();

    // useEffect(() => { 
    //     if(!isAuthenticated) {
    //         navigate(-1)
    //     } 
    // }, [isAuthenticated])

    const changePage = ({ selected = 0 }) => {
        setFilters({ ...filters, page: selected + 1 });
    }


    return (
        <Box py={6}>

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
                            withImg(item?.name, item?.mainImage),
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
                        <AdminProductLayout 
                            isLoading={isLoading} 
                            init={products} 
                            categories={categories}
                            filters={filters}
                            search={search}
                            setFilters={setFilters}
                            setSearch={setSearch}
                        >
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
                        </AdminProductLayout>
                    </AnimateRoute>
                </Container>
            </MainAppLayout>
        </PageMainContainer>
    )
}
