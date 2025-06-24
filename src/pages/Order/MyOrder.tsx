import { Box, Button, Flex, Heading, HStack, Icon, Input, Select, SimpleGrid, Spinner, Stack, Text, useDisclosure, VStack } from "@chakra-ui/react";
import AnimateRoute from "../../common/AnimateRoute";
import PageMainContainer from "../../common/PageMain";
import MainAppLayout from "../../layouts/MainAppLayout";
import { Container } from "../../styling/layout";
import { MdLockReset, MdOutlineArrowBackIos } from "react-icons/md";
import { useNavigate } from "react-router";
import { useGetOrder, useGetUserOrders } from "../../hooks/orders/orders";
import { Table, TableRow } from "../../common/Table/Table";
import { allCaps, capCase, moneyFormat, prettyDateFormat } from "../../utils/utils";
import { useEffect, useState } from "react";
import ModalCenter from "../../common/ModalCenter";
import { BsCheck, BsFilter, BsSearch } from "react-icons/bs";
import Pagination from "../../common/Pagination/Pagination";
import Drawer from "../../common/Drawer";
import Loader from "../../common/Loader";
import { useGetAuthState } from "../../hooks/auth/AuthenticationHook";
import { withImg } from "../Products/AdminProductPage";

const statusHistory = [ "order placed", "pending payment", "payment successful", "waiting to be shipped" ];

// const backendStatuses = [ "order placed", "payment successful" ];

export function TextDetails ({
    title,
    name = '-',
    direction = 'column',
    nameProps,
    titleProps,
    spacing,
    separator = ':',
    node,
    minW,
    my,
    mt,
    mb,
    mx,
    py,
    allCap,
}:any) {
    return (
        <Stack direction={direction} spacing={spacing} mx={mx} my={my} mt={mt} mb={mb} py={py}>
            <Text minW={minW || '16%'} color={'gray.500'} fontSize='13px' {...titleProps}>{`${allCap ? allCaps(title) : capCase(title)}${separator}`}</Text>
            {node ? 
            <Box>{name}</Box> :
            <Text fontSize='14px' fontWeight={600} {...nameProps}>{name}</Text>}
        </Stack>
    )
}


export function OrderView ({
    admin,
    // onClose,
    isLoad,
    initData = {}
}:any) {


    return (
        <Stack>

            {isLoad ?
                <Box
                    position="fixed"
                    top={0}
                    left={0}
                    width="100vw"
                    height="100vh"
                    bg="rgba(255, 255, 255, 0.5)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    zIndex={9999}
                >
                    <Spinner size="xl" color="blue.500" thickness="4px" />
                </Box> : null
            }

            <VStack align="start" spacing={4} position="relative" mb={6}>
                {statusHistory?.map((step, index) => {
                    const isCompleted = initData?.statusHistory?.includes(step);
                    const isLast = index === statusHistory?.length - 1;

                    return (
                    <Flex key={step} align="start" position="relative">
                        
                        <Box position="relative" mr={4}>
                            <Box
                                boxSize={8}
                                borderRadius="full"
                                bg={isCompleted ? "green.500" : "gray.300"}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                color="white"
                                zIndex={1}
                            >
                                <Icon as={BsCheck} w={8} h={8} />
                            </Box>

                            {/* Vertical Line (only if not last step) */}
                            {!isLast && (
                                <Box
                                    position="absolute"
                                    top="100%"
                                    left="50%"
                                    transform="translateX(-50%)"
                                    width="2px"
                                    height="32px"
                                    bg="gray.200"
                                />
                            )}
                        </Box>

                        {/* Step label */}
                        <Text
                            fontWeight={500}
                            color={isCompleted ? "green.600" : "gray.600"}
                            textTransform="capitalize"
                            mt={1}
                        >
                            {step}
                        </Text>
                    </Flex>
                    );
                })}
            </VStack>

            <Stack spacing={6}>

                {admin && 
                    <Box borderBottom={'1px solid #ccc'} py={3}>
                        <Text fontSize={'18px'} fontWeight={500}>User Details</Text>
                        <SimpleGrid columns={2} spacing={4} my={3}>
                            <TextDetails title="First Name" name={capCase(initData?.user?.firstName)} />
                            <TextDetails title="Last Name" name={capCase(initData?.user?.lastName)} />
                            <TextDetails title="Email" name={initData?.user?.email} />
                            <TextDetails title="Phone Number" name={`+${initData?.user?.phoneNumber ?? ""}`} />
                        </SimpleGrid>
                    </Box>
                }

                {admin && 
                    <Box borderBottom={'1px solid #ccc'} py={3}>
                        <Text fontSize={'18px'} fontWeight={500}>User Address Info</Text>
                        <SimpleGrid columns={3} spacing={4} my={3}>
                            <TextDetails title="Salutation" name={allCaps(initData?.address?.salutation)} />
                            <TextDetails title="First Name" name={capCase(initData?.address?.firstName)} />
                            <TextDetails title="Last Name" name={capCase(initData?.address?.lastName)} />
                            <TextDetails title="Phone Number" name={`+${initData?.address?.phoneNumber ?? ""}`} />
                            <TextDetails title="Phone Number 2" name={`${initData?.address?.phoneNumber2 ?? ""}`} />
                            <TextDetails title="Address" name={capCase(initData?.address?.address)} />
                            <TextDetails title="City" name={capCase(initData?.address?.city)} />
                            <TextDetails title="Country" name={capCase(initData?.address?.country)} />
                            <TextDetails title="Postal Code" name={initData?.address?.postalCode} />
                        </SimpleGrid>
                        <TextDetails title="Additional Info" name={capCase(initData?.address?.optionalData)} />
                    </Box>
                }

                <Box borderBottom={'1px solid #ccc'} py={3}>
                    <Text fontSize={'18px'} fontWeight={500}>Order Details</Text>
                    <SimpleGrid columns={[2, 3]} spacing={4} my={3}>
                        <TextDetails title="Date" name={prettyDateFormat(initData?.createdAt)} />
                        <TextDetails title="Order Number" name={initData?.orderNumber} />
                        <TextDetails title="Total Amount Paid" name={`€ ${moneyFormat(initData?.totalPaid ?? 0)}`} />
                        {/* <TextDetails title="Products Amount" name={`€ ${moneyFormat(initData?.productsAmount ?? 0)}`} /> */}
                        {/* <TextDetails title="Delivery Fee" name={`€ ${moneyFormat(initData?.deliveryFee ?? 0)}`} /> */}
                        <TextDetails title="Payment Method" name={capCase(initData?.paymentMethod)} />
                        <TextDetails title="Payment Status" name={capCase(initData?.paymentStatus)} />
                        <TextDetails title="Delivery Method" name={capCase(initData?.deliveryMethod)} />
                        <TextDetails title="Delivery Status" name={capCase(initData?.deliveryStatus)} />
                        <TextDetails title="Delivery Date" name={initData?.deliveryDate} />
                    </SimpleGrid>
                </Box>

                <Box >
                    <Text fontSize={'18px'} mb={3} fontWeight={500}>Selected Product's</Text>
                    {initData?.selectedProducts?.map((p:any, i:number) => (
                        <Box key={i} borderBottom={'1px solid #eee'}>
                            <Box mt={3}>{withImg(capCase(p?.product?.name), p?.product?.mainImage)}</Box>
                            <SimpleGrid columns={[2, 4]} spacing={4} py={3}>
                                <TextDetails title="Product Price" name={`€ ${moneyFormat(p?.product?.price ?? 0)}`} />
                                <TextDetails title="Product Size" name={p?.size} />
                                <TextDetails title="Product Color" name={p?.color} />
                                <TextDetails title="Product Quantity" name={p?.quantity} />
                            </SimpleGrid>
                        </Box>
                    ))}
                </Box>

            </Stack>

        </Stack>
    )
}

const tableHeads = ["S/N", "Date", "orderNumber", "Total Amount Paid", "Payment Method", "Payment Status", "Delivery Status", ""]
function MyOrdersMain ({ init = {}, myOrders = [], isLoading, filters, setFilters}:any) {

    const navigate = useNavigate()

    const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure()
    const { isOpen: isOpenFilter, onOpen: onOpenFilter, onClose: onCloseFilter } = useDisclosure()

    const [selected, setSelected] = useState<any>({})
    const [search, setSearch] = useState<any>({});

    const { data: order, isLoading: isLoad } = useGetOrder(selected?._id)

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

    return (

        <Box py={6}>
        
            <Heading textAlign="center" fontSize={["24px", '30px']} fontWeight={400} my={10}> MY ORDER </Heading>

            <HStack w='100%' justify={'space-between'}>
                <Button
                    leftIcon={<MdOutlineArrowBackIos />}
                    variant="ghost"
                    onClick={() => navigate('/profile')}
                    mt={4}
                    mb={4}
                    textDecor={'underline'}
                >
                    Back
                </Button>

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
                isEmpty={myOrders?.length <= 0}
                emptyText='No order found'
                pt={3}
                noIndexPad
            >
                {myOrders?.map((item:any, index:any) =>
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
                            {name: "View", onUse: () => {selectedInfo(item)}},
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
                        admin={false}
                        isLoad={isLoad}
                        onClose={onCloseEdit}
                        initData={order?.data ?? {}}
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

export default function MyOrderPage() {

    const navigate = useNavigate()
    const [filters, setFilters] = useState({})

    const { data: orderData = {}, isLoading: orderLoad } = useGetUserOrders(filters)
    const { data: myOrders = {} } = orderData

    const { isLoading, isAuthenticated } = useGetAuthState()
    useEffect(() => { if(!isLoading && isAuthenticated == false) { navigate('/products/vl') } }, [isLoading, isAuthenticated])
    if(isLoading) { return (<Loader />) }


    return (
        <PageMainContainer title='My Orders' description='My Orders'>
            <MainAppLayout noFooter>
                <Container>
                    <AnimateRoute>
                        <MyOrdersMain 
                            isLoading={orderLoad}
                            init={myOrders}
                            myOrders={myOrders?.orders ?? []}
                            filters={filters}
                            setFilters={setFilters}
                        />
                    </AnimateRoute>
                </Container>
            </MainAppLayout>
        </PageMainContainer>
    )
}
