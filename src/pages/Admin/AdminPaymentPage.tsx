import { Box, Button, Heading, HStack, Input, Select, SimpleGrid, Stack, useDisclosure } from "@chakra-ui/react";
import AnimateRoute from "../../common/AnimateRoute";
import PageMainContainer from "../../common/PageMain";
import MainAppLayout from "../../layouts/MainAppLayout";
import { Container } from "../../styling/layout";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useGetPayments } from "../../hooks/payments/paymentHook";
import { useGetAuthState } from "../../hooks/auth/AuthenticationHook";
import { allCaps, capCase, isSuperUser, moneyFormat, prettyDateFormat } from "../../utils/utils";
import Loader from "../../common/Loader";
import Notify from "../../utils/notify";
import { MdLockReset, MdOutlineArrowBackIos, MdOutlinePayment } from "react-icons/md";
import DataInfo from "../../common/DataInfo";
import { BsFilter, BsSearch } from "react-icons/bs";
import { Table, TableRow } from "../../common/Table/Table";
import Pagination from "../../common/Pagination/Pagination";
import Drawer from "../../common/Drawer";

const tableHeads = ["S/N", "Date", "Payment Reference Id", "Order Number", "Amount", "Payment Method", "Payment Status", "Customer Name", "Customer Email", "Customer Phone",]
function AdminPaymentMain ({ init = {}, payments = [], isLoading, filters, setFilters }:any) {

    const navigate = useNavigate()
    const [search, setSearch] = useState<any>({});
    const { isOpen: isOpenFilter, onOpen: onOpenFilter, onClose: onCloseFilter } = useDisclosure()

    const changePage = ({ selected = 0 }) => {
        setFilters({ ...filters, page: selected + 1 });
    }

    const onFilter = () => {
        setFilters({ ...filters, ...search });
        onCloseFilter()
        setSearch((prev: any) => ({
            ...prev, 
            search: "",
            paymentStatus: "", 
        }))
    }


    const dataInformationArray = [
        // {title: 'Total Payments', value: init?.totalPayments ?? "-", iconColor: 'black', icon: MdOutlinePayment},
        {title: 'Total Amount', value: init?.totalAmount ?? "-", iconColor: 'black', icon: MdOutlinePayment, isshortFormat: true},
        {title: 'Success Payments', value: init?.successPayments ?? "-", iconColor: 'green', icon: MdOutlinePayment, isshortFormat: false},
        {title: 'Pending Payments', value: init?.pendingPayments ?? "-", iconColor: 'purple', icon: MdOutlinePayment, isshortFormat: false},
        {title: 'Failed Payments', value: init?.failedPayments ?? "-", iconColor: 'red', icon: MdOutlinePayment, isshortFormat: false},
    ]

    return(
        <Box py={6}>
            <Heading textAlign="center" fontSize={["24px", '30px']} fontWeight={400} my={4}> PAYMENTS </Heading>

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
                            isshortFormat={info?.isshortFormat}
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
                isEmpty={payments?.length <= 0}
                emptyText='No payment yet'
                pt={3}
                noIndexPad
            >
                {payments?.map((item:any, index:any) =>
                    <TableRow
                        key={index}
                        data={[
                            (index + 1 ),
                            prettyDateFormat(item?.createdAt),
                            item?.paymentReferenceId,
                            item?.orderNumber,
                            `€ ${moneyFormat(item?.amount ?? 0)}`,
                            allCaps(item?.paymentMethod),
                            item?.paymentStatus,
                            `${capCase(item?.user?.firstName)} ${capCase(item?.user?.lastName)}`,
                            item?.user?.email,
                            `+${item?.user?.phoneNumber}`,
                        ]}
                        noIndexPad
                    />
                )}
            </Table>

            <Pagination
                onPageChange={changePage}
                currentPage={init?.currentPage}
                pageCount={init?.totalPages}
            />

            <Drawer 
                placement={'top'}
                isOpen={isOpenFilter}
                onClose={onCloseFilter}
                header="Filter: "
                body={
                    <Stack w='100%'>
                        <SimpleGrid columns={[1,2]} spacing={4} py={4}>
                            <Input border={'1px solid gray'} placeholder={"Search Payment"} onChange={ (e) => setSearch((prev: any) => ({...prev, search: e.target.value })) }/>
                            <Select border={'1px solid gray'} placeholder="Search Payment Status" onChange={ (e) => setSearch((prev: any) => ({...prev, paymentStatus: e.target.value })) }>
                                {["pending", "successful", "failed", "cancelled"].map((status:any, i) => ( <option key={i} value={status}>{capCase(status)} </option> ))}
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

export default function AdminPaymentPage() {

    const navigate = useNavigate()
    const [filters, setFilters] = useState<any>({})

    const { data: paymentData = {}, isLoading: payLoading } = useGetPayments(filters)
    const { data: payments = {} } = paymentData

    const { isLoading, isAuthenticated, user } = useGetAuthState()
    const isAdmin = isSuperUser(user?.role)
    useEffect(() => { if(!isLoading && isAuthenticated == false) { navigate('/products/vl') } }, [isLoading, isAuthenticated])
    useEffect(() => { if(!isLoading && isAdmin == false && isAuthenticated == true ) {navigate('/profile'); Notify.error("Not Authorized!!")} }, [isLoading, isAuthenticated])
    if(isLoading) { return (<Loader />) }

    return (
        <PageMainContainer title='Payments' description='Payments'>
            <MainAppLayout noFooter>
                <Container>
                    <AnimateRoute>
                        <AdminPaymentMain 
                            isLoading={payLoading}
                            init={payments}
                            payments={payments?.payments ?? []}
                            filters={filters}
                            setFilters={setFilters}
                        />
                    </AnimateRoute>
                </Container>
            </MainAppLayout>
        </PageMainContainer>
    )
}
