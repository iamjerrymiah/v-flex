import { useNavigate } from "react-router";
import AnimateRoute from "../../common/AnimateRoute";
import PageMainContainer from "../../common/PageMain";
import MainAppLayout from "../../layouts/MainAppLayout";
import { Container } from "../../styling/layout";
import { Avatar, Box, Flex } from "@chakra-ui/react";
import { Table, TableRow } from "../../common/Table/Table";
import { useDeleteProduct, useGetProducts, useUpdateProduct } from "../../hooks/products/products";
import { capCase, isSuperUser, moneyFormat } from "../../utils/utils";
import Pagination from "../../common/Pagination/Pagination";
import { useEffect, useState } from "react";
import { useGetProductCollections } from "../../hooks/products/collections";
import AdminProductLayout from "./components/AdminProductLayout";
import Notify from "../../utils/notify";
import { useConfirmAction } from "../../utils/useActions";
import ConfirmModal from "../../common/ConfirmModal";
import { useCategoryContext } from "../../providers/CategoryContext";
import { useGetAuthState } from "../../hooks/auth/AuthenticationHook";
import Loader from "../../common/Loader";

export function withImg (datum:any, img?:any) {
    return (
        <Flex align="center" mt="auto">
            <Avatar src={img} name={datum} size="md" />
                <Box ml={2}>
                    <Box fontWeight={500} color='#101828'>{capCase(datum)}</Box>
                </Box>
        </Flex>
    )
}

const tableHeads = ["S/N", "Product", "Price", "Quantity", "Is Available", "Is Disabled", ""]
function AdminProductMain ({ products = [], isLoading = false, init, filters, setFilters }:any) {

    const navigate = useNavigate()

    const { openConfirm, closeConfirm, isOpenConfirm, current } = useConfirmAction()
    const { openConfirm: openConfirmActivate, closeConfirm: closeConfirmActivate, isOpenConfirm: isOpenConfirmActivate, current: currentActivate } = useConfirmAction()
    const { openConfirm: openConfirmDeactivate, closeConfirm: closeConfirmDeactivate, isOpenConfirm: isOpenConfirmDeactivate, current: currentDeactivate } = useConfirmAction()

    const changePage = ({ selected = 0 }) => {
        setFilters({ ...filters, page: selected + 1 });
    }

    const shouldDelete = (data: any) => {
        openConfirm(data)
    }
    const shouldActivate = (data: any) => { openConfirmActivate(data) }
    const shouldDeactivate = (data: any) => { openConfirmDeactivate(data) }

    const { mutateAsync: action } = useUpdateProduct()
    const handleActivateDeactivate = async (status:boolean, current:any) => {
        try {
            const res:any =  await action({productId: current?._id, disabled: status})
            Notify.success("Success")
            return res;
        } catch(e:any) {
            Notify.error(e?.message ?? "Failed")
            return e
        }
    }

    const { mutateAsync: deleteProductAction } = useDeleteProduct()
    const handleDelete = async () => {
        try {
            const res:any =  await deleteProductAction({productId: current?._id})
            Notify.success("Deleted")
            return res;
        } catch(e:any) {
            Notify.error(e?.message ?? "Failed")
            return e
        }
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
                            item?.disabled == true ? "Disabled" : "Enabled",
                        ]}
                        noIndexPad
                        options={[
                            {name: "View", onUse: () => navigate(`/vl/admin/products/${item?._id}`)},
                            {
                                name: `${item?.disabled === true ? "Enable" : "Disable"}`, 
                                color: `${item?.disabled === true ? "green.700" : "red.700"}`, 
                                onUse: item?.disabled === true ? () => { shouldActivate(item) } : () => { shouldDeactivate(item) } 
                            },
                            {name: "Delete", color: 'red.900', onUse: () => shouldDelete(item)},
                        ]}
                    />
                )}
            </Table>

            <Pagination
                onPageChange={changePage}
                currentPage={init?.currentPage}
                pageCount={init?.totalPages}
            />

            <ConfirmModal
                isOpen={isOpenConfirm}
                onConfirm={handleDelete}
                onClose={closeConfirm}
            />

            <ConfirmModal
                isOpen={isOpenConfirmActivate}
                onConfirm={() => handleActivateDeactivate(false, currentActivate)}
                onClose={closeConfirmActivate}
            />

            <ConfirmModal
                isOpen={isOpenConfirmDeactivate}
                onConfirm={() => handleActivateDeactivate(true, currentDeactivate)}
                onClose={closeConfirmDeactivate}
            />

        </Box>
    )
}

export default function AdminProductPage() {

    const navigate = useNavigate()
    const { topCategory, subCategory, linkCategory } = useCategoryContext();

    const { data: collectionData = {} } = useGetProductCollections({})
    const { data: categories = [] } = collectionData

    const [search, setSearch] = useState<any>({});
    
    const [filters, setFilters] = useState({ disabled: "all"})
    
    const { data: productData = {}, isLoading: productLoad} = useGetProducts(filters)
    const { data: products = {} } = productData

    useEffect(() => {
        if (linkCategory?._id) { setFilters(prev => ({ ...prev, categoryId: linkCategory._id })) }
    }, [linkCategory]);

    useEffect(() => {
        if (subCategory?._id) { setFilters(prev => ({ ...prev, categoryId: subCategory._id })) }
    }, [subCategory]);

    useEffect(() => {
        if (topCategory?._id) { setFilters(prev => ({ ...prev, categoryId: topCategory._id })) }
    }, [topCategory]);

    const { isLoading, isAuthenticated, user } = useGetAuthState()
    const isAdmin = isSuperUser(user?.role)
    useEffect(() => { if(!isLoading && isAuthenticated == false) { navigate('/products/vl') } }, [isLoading, isAuthenticated])
    useEffect(() => { if(!isLoading && isAdmin == false && isAuthenticated == true ) {navigate('/profile'); Notify.error("Not Authorized!!")} }, [isLoading, isAuthenticated])
    if(isLoading) { return (<Loader />) }

    return (
        <>
            {/* {isAdmin &&  */}
                <PageMainContainer title='Products' description='Products'>
                    <MainAppLayout noFooter>
                        <Container>
                            <AnimateRoute>
                                <AdminProductLayout 
                                    isLoading={productLoad} 
                                    init={products} 
                                    categories={categories}
                                    filters={filters}
                                    search={search}
                                    setFilters={setFilters}
                                    setSearch={setSearch}
                                >
                                <AdminProductMain 
                                    isLoading={productLoad}
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
            {/* } */}
        </>
    )
}
