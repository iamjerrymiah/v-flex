import { Box, Button, Heading, HStack, Input, Select, SimpleGrid, Stack, useDisclosure } from "@chakra-ui/react"
import AnimateRoute from "../../common/AnimateRoute"
import PageMainContainer from "../../common/PageMain"
import MainAppLayout from "../../layouts/MainAppLayout"
import { Container } from "../../styling/layout"
import { MdLockReset, MdOutlineArrowBackIos } from "react-icons/md"
import { useNavigate } from "react-router"
import { useGetAllOrders, useGetOrder } from "../../hooks/orders/orders"
import { Table, TableRow } from "../../common/Table/Table"
import { allCaps, capCase, isSuperUser, moneyFormat, prettyDateFormat } from "../../utils/utils"
import { useEffect, useState } from "react"
import Pagination from "../../common/Pagination/Pagination"
import ModalCenter from "../../common/ModalCenter"
import { OrderView } from "./MyOrder"
import { BsFilter, BsSearch } from "react-icons/bs"
import Drawer from "../../common/Drawer"
import DataInfo from "../../common/DataInfo"
import { TbShoppingCartStar } from "react-icons/tb"
import { useGetAuthState } from "../../hooks/auth/AuthenticationHook"
import Loader from "../../common/Loader"
import Notify from "../../utils/notify"


const tableHeads = ["S/N", "Date", "orderNumber", "Total Amount Paid", "Payment Method", "Payment Status", "Delivery Status", ""]
function OrdersMain ({ init = {}, orders = [], isLoading, filters, setFilters }: any) {
    
    const [selected, setSelected] = useState<any>({})
    const [search, setSearch] = useState<any>({});

    const navigate = useNavigate()

    const { data: order, isLoading: isLoad } = useGetOrder(selected?._id)

    const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure()
    const { isOpen: isOpenFilter, onOpen: onOpenFilter, onClose: onCloseFilter } = useDisclosure()

    const selectedInfo = (d: any) => {
        setSelected(d)
        onOpenEdit()
    }

    const onFilter = () => {
        setFilters({ ...filters, ...search });
        onCloseFilter()
        setSearch((prev: any) => ({
            ...prev, 
            search: "",
            deliveryStatus: "", 
            paymentStatus: "", 
            deliveryMethod: "", 
            paymentMethod: ""
        }))
    }

    const changePage = ({ selected = 0 }) => {
        setFilters({ ...filters, page: selected + 1 });
    }

    const dataInformationArray = [
        {title: 'Total Orders', value: init?.totalOrders ?? "-", iconColor: 'black', icon: TbShoppingCartStar},
        {title: 'Total Pending Orders', value: init?.pendingOrders ?? "-", iconColor: 'gray', icon: TbShoppingCartStar},
        {title: 'Total Successful Orders', value: init?.successOrders ?? "-", iconColor: 'green', icon: TbShoppingCartStar},
        {title: 'Total Failed Orders', value: init?.failedOrders ?? "-", iconColor: 'red', icon: TbShoppingCartStar},
    ]

    return (
        <Box py={6}>
        
            <Heading textAlign="center" fontSize={["24px", '30px']} fontWeight={400} my={6}> ORDER LIST </Heading>

            <Button
                leftIcon={<MdOutlineArrowBackIos />}
                variant="ghost"
                onClick={() => navigate(`/profile`)}
                mt={4}
                mb={4}
                textDecor={'underline'}
            >
                Back
            </Button>

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

            <HStack justify={'flex-end'} w='100%'>

                <Button
                    leftIcon={<BsFilter size={20}/>}
                    onClick={onOpenFilter}
                    color={'white'}
                    bgColor={'blackAlpha.800'}
                >
                    Filter
                </Button>
            </HStack>

            <Table
                headings={tableHeads}
                loading={isLoading}
                isEmpty={orders?.length <= 0}
                emptyText='No order found'
                pt={3}
                noIndexPad
            >
                {orders?.map((item:any, index:any) =>
                    <TableRow
                        key={index}
                        data={[
                            (index + 1 ),
                            prettyDateFormat(item?.createdAt),
                            item?.orderNumber,
                            `€ ${moneyFormat(item?.totalPaid ?? 0)}`,
                            allCaps(item?.paymentMethod ?? "-"),
                            capCase(item?.paymentStatus ?? "-"),
                            capCase(item?.deliveryStatus ?? "-"),
                            // item?.deliveryDate ?? "-",
                        ]}
                        noIndexPad
                        options={[
                            {name: "View", onUse: () => { selectedInfo(item) }},
                        ]}
                    />
                )}
            </Table>
            
            <Pagination
                onPageChange={changePage}
                currentPage={init?.currentPage}
                pageCount={init?.totalPages}
            />

            <ModalCenter 
                size={'3xl'}
                isOpen={isOpenEdit}
                onClose={onCloseEdit}
                header='View Order'
                body={
                    <OrderView 
                        admin={true}
                        onClose={onCloseEdit}
                        initData={order?.data ?? {}}
                        isLoad={isLoad}
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
                            <Input border={'1px solid gray'} placeholder={"Search Order"} onChange={ (e) => setSearch((prev: any) => ({...prev, search: e.target.value })) }/>
                            <Select border={'1px solid gray'} placeholder="Search Delivery Status" onChange={ (e) => setSearch((prev: any) => ({...prev, deliveryStatus: e.target.value })) }>
                                {["pending", "shipped", "delivered", "out for delivery", "waiting to be shipped", "cancelled"].map((status:any, i) => ( <option key={i} value={status}>{capCase(status)} </option> ))}
                            </Select>
                            <Select border={'1px solid gray'} placeholder="Search Payment Status" onChange={ (e) => setSearch((prev: any) => ({...prev, paymentStatus: e.target.value })) }>
                                {["pending", "successful", "failed", "cancelled"].map((status:any, i) => ( <option key={i} value={status}>{capCase(status)} </option> ))}
                            </Select>
                            <Select border={'1px solid gray'} placeholder="Search Delivery Method" onChange={ (e) => setSearch((prev: any) => ({...prev, deliveryMethod: e.target.value })) }>
                                {["door delivery", "pick up"].map((status:any, i) => ( <option key={i} value={status}>{capCase(status)} </option> ))}
                            </Select>
                            <Select border={'1px solid gray'} placeholder="Search Payment Method" onChange={ (e) => setSearch((prev: any) => ({...prev, paymentMethod: e.target.value })) }>
                                {["paypal", "card", "transfer", "ideal"].map((status:any, i) => ( <option key={i} value={status}>{capCase(status)} </option> ))}
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

export default function OrderPage() {
    
    const navigate = useNavigate()
    const [filters, setFilters] = useState({})

    const { data: orderData = {}, isLoading: orderLoad } = useGetAllOrders(filters)
    const { data: orders = {} } = orderData

    const { isLoading, isAuthenticated, user } = useGetAuthState()
    const isAdmin = isSuperUser(user?.role)
    useEffect(() => { if(!isLoading && isAuthenticated == false) { navigate('/products/vl') } }, [isLoading, isAuthenticated])
    useEffect(() => { if(!isLoading && isAdmin == false && isAuthenticated == true ) {navigate('/profile'); Notify.error("Not Authorized!!")} }, [isLoading, isAuthenticated])
    if(isLoading) { return (<Loader />) }

    return (
        <PageMainContainer title='Orders' description='Orders'>
            <MainAppLayout noFooter>
                <Container>
                    <AnimateRoute>
                        <OrdersMain 
                            isLoading={orderLoad}
                            init={orders}
                            orders={orders?.orders ?? []}
                            filters={filters}
                            setFilters={setFilters}
                        />
                    </AnimateRoute>
                </Container>
            </MainAppLayout>
        </PageMainContainer>
    )
}
