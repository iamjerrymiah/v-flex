import { Box, Button, Flex, Heading, Icon, SimpleGrid, Spinner, Stack, Text, useDisclosure, VStack } from "@chakra-ui/react";
import AnimateRoute from "../../common/AnimateRoute";
import PageMainContainer from "../../common/PageMain";
import MainAppLayout from "../../layouts/MainAppLayout";
import { Container } from "../../styling/layout";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { useNavigate } from "react-router";
import { useGetOrder, useGetUserOrders } from "../../hooks/orders/orders";
import { Table, TableRow } from "../../common/Table/Table";
import { allCaps, capCase, moneyFormat } from "../../utils/utils";
import { useState } from "react";
// import { useGetAuthState } from "../../hooks/auth/AuthenticationHook";
import ModalCenter from "../../common/ModalCenter";
import { BsCheck } from "react-icons/bs";
import Pagination from "../../common/Pagination/Pagination";

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

                <Box borderBottom={'1px solid #ccc'} py={3}>
                    <Text fontSize={'18px'} fontWeight={500}>Order Details</Text>
                    <SimpleGrid columns={[2, 3]} spacing={4} my={3}>
                        <TextDetails title="Order Number" name={initData?.orderNumber} />
                        <TextDetails title="Total Amount Paid" name={`€ ${moneyFormat(initData?.totalPaid ?? 0)}`} />
                        <TextDetails title="Products Amount" name={`€ ${moneyFormat(initData?.productsAmount ?? 0)}`} />
                        <TextDetails title="Payment Method" name={capCase(initData?.paymentMethod)} />
                        <TextDetails title="Payment Status" name={capCase(initData?.paymentStatus)} />
                        <TextDetails title="Delivery Fee" name={`€ ${moneyFormat(initData?.deliveryFee ?? 0)}`} />
                        <TextDetails title="Delivery Method" name={capCase(initData?.deliveryMethod)} />
                        <TextDetails title="Delivery Status" name={capCase(initData?.deliveryStatus)} />
                        <TextDetails title="Delivery Date" name={initData?.deliveryDate} />
                    </SimpleGrid>
                </Box>

                <Box >
                    <Text fontSize={'18px'} mb={3} fontWeight={500}>Selected Product's</Text>
                    {initData?.selectedProducts?.map((p:any, i:number) => (
                        <Box key={i} borderBottom={'1px solid #eee'}>
                            <SimpleGrid columns={[2, 3]} spacing={4} py={3}>
                                <TextDetails title="Product Name" name={capCase(p?.product?.name)} />
                                <TextDetails title="Product Price" name={`€ ${moneyFormat(p?.product?.price ?? 0)}`} />
                                <TextDetails title="Product Size" name={p?.size} />
                                <TextDetails title="Product Color" name={p?.color} />
                                <TextDetails title="Product Size" name={p?.quantity} />
                            </SimpleGrid>
                        </Box>
                    ))}
                </Box>

            </Stack>

        </Stack>
    )
}

const tableHeads = ["S/N", "orderNumber", "Total Amount Paid", "Payment Method", "Payment Status", "Delivery Status", ""]
function MyOrdersMain ({ init = {}, myOrders = [], isLoading, filters, setFilters}:any) {

    const navigate = useNavigate()
    // const { isAuthenticated } =  useGetAuthState();

    const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure()

    const [selected, setSelected] = useState<any>({})

    const { data: order, isLoading: isLoad } = useGetOrder(selected?._id)

    const selectedInfo = (d: any) => {
        setSelected(d)
        onOpenEdit()
    }

    const changePage = ({ selected = 0 }) => {
        setFilters({ ...filters, page: selected + 1 });
    }

    // useEffect(() => { 
    //     if(!isAuthenticated) {
    //         navigate(-1)
    //     } 
    // }, [isAuthenticated])

    return (

        <Box py={6}>
        
            <Heading textAlign="center" fontSize={["24px", '30px']} fontWeight={400} my={10}> MY ORDER </Heading>

            <Button
                leftIcon={<MdOutlineArrowBackIos />}
                variant="ghost"
                onClick={() => navigate(-1)}
                mt={4}
                mb={4}
                textDecor={'underline'}
            >
                Back
            </Button>

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
                            // {name: "Delete", color: 'red.700', onUse: () => shouldDelete(item)},
                        ]}
                    />
                )}
            </Table>

            <Pagination
                pageCount={init?.totalPages}
                onPageChange={changePage}
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

        </Box>
    )
}

export default function MyOrderPage() {

    const [filters, setFilters] = useState({})

    const { data: orderData = {}, isLoading } = useGetUserOrders(filters)
    const { data: myOrders = {} } = orderData


    return (
        <PageMainContainer title='My Orders' description='My Orders'>
            <MainAppLayout noFooter>
                <Container>
                    <AnimateRoute>
                        <MyOrdersMain 
                            isLoading={isLoading}
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
