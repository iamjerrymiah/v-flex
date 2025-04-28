import { useNavigate } from "react-router";
import AnimateRoute from "../../common/AnimateRoute";
import PageMainContainer from "../../common/PageMain";
import MainAppLayout from "../../layouts/MainAppLayout";
import { Container } from "../../styling/layout";
import { useGetAuthState } from "../../hooks/auth/AuthenticationHook";
import { useEffect } from "react";
import { Box, Button, Heading, HStack } from "@chakra-ui/react";
import { MdAddToPhotos, MdOutlineArrowBackIos } from "react-icons/md";
import { Table, TableRow } from "../../common/Table/Table";
import { useGetProducts } from "../../hooks/products/products";
import { capCase, moneyFormat } from "../../utils/utils";
import Pagination from "../../common/Pagination/Pagination";
import { useState } from "react";


const tableHeads = ["S/N", "Name", "Price", "Quantity", "Is Available", ""]

function AdminProductMain ({ products = [], isLoading = false, init, filters, setFilters }:any) {

    const navigate = useNavigate()
    const { isAuthenticated } =  useGetAuthState();

    useEffect(() => { 
        if(!isAuthenticated) {
            navigate(-1)
        } 
    }, [isAuthenticated])

    const changePage = ({ selected = 0 }) => {
        setFilters({ ...filters, page: selected + 1 });
    }

    return (
        <Box pt={10}>

            <Heading textAlign="center" fontSize={["24px", '30px']} fontWeight={400} my={10}> PRODUCTS </Heading>

            <HStack justify={'space-between'} w={'100%'} my={4}>
                <Button
                    leftIcon={<MdOutlineArrowBackIos />}
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    textDecor={'underline'}
                >
                    Back
                </Button>

                <Button
                    leftIcon={<MdAddToPhotos />}
                    onClick={() => navigate(`/admin/products/create`)}
                    color={'white'}
                    bgColor={'blue.700'}
                >
                    Add
                </Button>

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
                            moneyFormat(item?.price ?? 0.0),
                            item?.quantity ?? "-",
                            item?.availability == true ? "Yes" : "No",
                        ]}
                        noIndexPad
                        options={[
                            // {name: "View", onUse: () => navigate(`/admin/products/${selected?._id}`)},
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
    
    const [filters, setFilters] = useState({} as any)
    
    const { data: productData = {}, isLoading } = useGetProducts(filters)
    const { data: products = {} } = productData

    return (
        <PageMainContainer title='Products' description='Products'>
            <MainAppLayout>
                <Container>
                    <AnimateRoute>
                        <AdminProductMain 
                            isLoading={isLoading}
                            products={products?.products}
                            init={products}
                            filters={filters}
                            setFilters={setFilters}
                        />
                    </AnimateRoute>
                </Container>
            </MainAppLayout>
        </PageMainContainer>
    )
}
