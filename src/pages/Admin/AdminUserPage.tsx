import { Box, Button, Heading, HStack, Input, Select, SimpleGrid, Spinner, Stack, Text, useDisclosure } from "@chakra-ui/react";
import AnimateRoute from "../../common/AnimateRoute";
import PageMainContainer from "../../common/PageMain";
import MainAppLayout from "../../layouts/MainAppLayout";
import { Container } from "../../styling/layout";
import { useNavigate } from "react-router";
import { MdLockReset, MdOutlineArrowBackIos } from "react-icons/md";
import { Table, TableRow } from "../../common/Table/Table";
import { useActivateDeactivate, useChangeUserRole, useGetAllUsers, useGetOneUserByEmail } from "../../hooks/user/users";
import { allCaps, allLower, capCase, isJustSuperAdmin, isSuperUser } from "../../utils/utils";
import { useEffect, useState } from "react";
import { BsFilter, BsSearch } from "react-icons/bs";
import Pagination from "../../common/Pagination/Pagination";
import Drawer from "../../common/Drawer";
import ModalCenter from "../../common/ModalCenter";
import { TextDetails } from "../Order/MyOrder";
import Notify from "../../utils/notify";
import ConfirmModal from "../../common/ConfirmModal";
import { useConfirmAction } from "../../utils/useActions";
import DataInfo from "../../common/DataInfo";
import { FaUsers } from "react-icons/fa";
import { useGetAuthState } from "../../hooks/auth/AuthenticationHook";
import Loader from "../../common/Loader";

const tableHeads = ["S/N", "Salutation", "First Name", "Last Name", "Email", "Phone Number", "Is Email Verified?", "Status", ""]
function AdminUserMain ({ init = {}, users = [], isLoading, filters, setFilters, isSuperAdmin }: any) {
    
    const [one, setOne] = useState<any>({})
    const [changeRole, setChangeRole] = useState<any>({})
    const [search, setSearch] = useState<any>({});

    const { data: selectedData = {}, isLoading: isLoad } = useGetOneUserByEmail(one?.email)
    const { data: selected = {} } = selectedData;

    const [selectedRole, setSelectedRole] = useState<string>(changeRole?.role ?? "");

    const navigate = useNavigate()

    const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure()
    const { isOpen: isOpenRole, onOpen: onOpenRole, onClose: onCloseRole } = useDisclosure()
    const { isOpen: isOpenFilter, onOpen: onOpenFilter, onClose: onCloseFilter } = useDisclosure()

    const { openConfirm: openConfirmActivate, closeConfirm: closeConfirmActivate, isOpenConfirm: isOpenConfirmActivate, current: currentActivate } = useConfirmAction()
    const { openConfirm: openConfirmDeactivate, closeConfirm: closeConfirmDeactivate, isOpenConfirm: isOpenConfirmDeactivate, current: currentDeactivate } = useConfirmAction()

    const selectedInfo = (d: any) => {
        setOne(d)
        onOpenEdit()
    }

    const changeRoleInfo = (d: any) => {
        setChangeRole(d)
        onOpenRole()
    }

    const onFilter = () => {
        setFilters({ ...filters, ...search });
        onCloseFilter()
        setSearch((prev: any) => ({...prev, search: "" }))
    }

    const changePage = ({ selected = 0 }) => {
        setFilters({ ...filters, page: selected + 1 });
    }

    const closed = () => {
        setChangeRole({})
        onCloseRole()
    }
    
    const { mutateAsync: action } = useActivateDeactivate()
    const { mutateAsync: changeRoleAction, isPending: rolePend } = useChangeUserRole()

    const shouldActivate = (data: any) => { openConfirmActivate(data) }
    const shouldDeactivate = (data: any) => { openConfirmDeactivate(data) }

    const handleActivateDeactivate = async (status:string, current:any) => {
        try {
            const res:any =  await action({id: current?._id, status: status})
            Notify.success("Success")
            return res;
        } catch(e:any) {
            Notify.error(e?.message ?? "Failed")
            return e
        }
    }

    const handleRoleChange = async (data:any) => {
        try {
            const res:any =  await changeRoleAction({ userId: data?._id, role: selectedRole ?? changeRole?.role })
            Notify.success("Success")
            closed()
            return res;
        } catch(e:any) {
            Notify.error(e?.message ?? "Failed")
            return e
        }
    }

    const dataInformationArray = [
        {title: 'Total Users', value: init?.totalUsers ?? "-", iconColor: 'black', icon: FaUsers},
        {title: 'Total Active Users', value: init?.activatedUsers ?? "-", iconColor: 'green', icon: FaUsers},
        {title: 'Total Disabled Users', value: init?.deactivatedUsers ?? "-", iconColor: 'red', icon: FaUsers},
    ]

    return (
        <Box py={6}>

            <Heading textAlign="center" fontSize={["24px", '30px']} fontWeight={400} my={4}> USERS </Heading>

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
                isEmpty={users?.length <= 0}
                emptyText='No user found'
                pt={3}
                noIndexPad
            >
                {users?.map((item:any, index:any) =>
                    <TableRow
                        key={index}
                        // onClickRow={}
                        data={[
                            (index + 1 ),
                            allCaps(item?.salutation ?? "-"),
                            capCase(item?.firstName ?? "-"),
                            capCase(item?.lastName ?? "-"),
                            allLower(item?.email ?? "-"),
                            `+${item?.phoneNumber}`,
                            capCase(item?.emailVerified === true ? "Yes" : "No"),
                            capCase(item?.status)
                        ]}
                        options={[
                            {name: "View", onUse: () => { selectedInfo(item) }},
                            isSuperAdmin && {name: "Change Role", onUse: () => { changeRoleInfo(item) }},
                            {
                                name: `${allLower(item?.status) === "activated" ? "Deactivate" : "Activate"}`, 
                                color: `${allLower(item?.status) === "activated" ? "red.700" : "green.700"}`, 
                                onUse: allLower(item?.status) === "activated" ? () => { shouldDeactivate(item) } : () => { shouldActivate(item) } 
                            },
                        ].filter(Boolean)}
                        noIndexPad
                    />
                )}
            </Table>

            <Pagination
                onPageChange={changePage}
                currentPage={init?.currentPage}
                pageCount={init?.totalPages}
            />

            <ConfirmModal
                isOpen={isOpenConfirmActivate}
                onConfirm={() => handleActivateDeactivate("activated", currentActivate)}
                onClose={closeConfirmActivate}
            />

            <ConfirmModal
                isOpen={isOpenConfirmDeactivate}
                onConfirm={() => handleActivateDeactivate("deactivated", currentDeactivate)}
                onClose={closeConfirmDeactivate}
            />

            <Drawer 
                placement={'top'}
                isOpen={isOpenFilter}
                onClose={onCloseFilter}
                header="Filter: "
                body={
                    <Stack w='100%'>
                        <SimpleGrid columns={[1, 2]} spacing={4} py={4}>
                            <Input border={'1px solid gray'} placeholder={"Search User"} onChange={ (e) => setSearch((prev: any) => ({...prev, search: e.target.value })) }/>
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

            <ModalCenter 
                size={'3xl'}
                isOpen={isOpenRole}
                onClose={onCloseRole}
                header='Change Role'
                body={
                    <form onSubmit={(e) => { e?.preventDefault(); handleRoleChange(changeRole); }}>
                        <Stack spacing={4}>
                            <HStack>
                                <Text w={'13%'}>Role:</Text>
                                <Select mb={4} value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} required>
                                    <option value={""}>{"Select Role"}</option>
                                    {["user", "admin", "superAdmin"]?.map((role:any, index:any) => (
                                        <option key={index} value={role}>{role}</option>
                                    ))}
                                </Select>
                            </HStack>

                            <HStack w={'full'} justify={'space-between'} spacing={3} mt={6}>
                                <Button 
                                    w={'100%'} 
                                    bg="gray" 
                                    onClick={closed}
                                > 
                                    Back 
                                </Button>
                                <Button 
                                    w={'100%'}
                                    bg="blue.700" 
                                    type='submit'
                                    color="white" 
                                    isDisabled={rolePend || selectedRole == ""}
                                    isLoading={rolePend}
                                >
                                    Save
                                </Button>
                                
                            </HStack>
                        </Stack>
                    </form>
                }
            />

            <ModalCenter 
                size={'3xl'}
                isOpen={isOpenEdit}
                onClose={onCloseEdit}
                header='View User'
                body={
                    <Stack spacing={6}>

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

                        <Box borderBottom={'1px solid'} py={3}>
                            <Text fontSize={'18px'} fontWeight={500}>User Details</Text>
                            <SimpleGrid columns={[2, 4]} spacing={4} my={3}>
                                <TextDetails title="Salutation" name={allCaps(selected?.salutation) ?? ""} />
                                <TextDetails title="First Name" name={`${capCase(selected?.firstName) ?? ""}`} />
                                <TextDetails title="Last Name" name={`${capCase(selected?.lastName) ?? ""}`} />
                                <TextDetails title="Email" name={selected?.email ?? ""} />
                                <TextDetails title="Phone Number" name={`+${selected?.phoneNumber ?? ""}`} />
                                <TextDetails title="Country" name={`${capCase(selected?.country) ?? ""}`} />
                                <TextDetails title="Role" name={capCase(selected?.role) ?? ""} />
                                <TextDetails title="Is Email Verified?" name={capCase(selected?.emailVerified === true ? "Yes" : "No") ?? ""} />
                                <TextDetails title="Status" name={capCase(selected?.status) ?? ""} />
                            </SimpleGrid>
                        </Box>

                        {selected?.address1 &&
                            <Box borderBottom={'1px solid'} py={3}>
                                <Text fontSize={'18px'} fontWeight={500}>User Address 1</Text>
                                <SimpleGrid columns={[2, 4]} spacing={4} my={3}>
                                    <TextDetails title="Salutation" name={allCaps(selected?.address1?.salutation) ?? ""} />
                                    <TextDetails title="First Name" name={`${capCase(selected?.address1?.firstName) ?? ""}`} />
                                    <TextDetails title="Last Name" name={`${capCase(selected?.address1?.lastName) ?? ""}`} />
                                    {/* <TextDetails title="Email" name={selected?.address1?.email ?? ""} /> */}
                                    <TextDetails title="Phone Number" name={`+${selected?.address1?.phoneNumber ?? ""}`} />
                                    <TextDetails title="Phone Number 2" name={`${selected?.address1?.phoneNumber2 ?? ""}`} />
                                    <TextDetails title="Address" name={`${capCase(selected?.address1?.address) ?? ""}`} />
                                    <TextDetails title="City" name={`${capCase(selected?.address1?.city) ?? ""}`} />
                                    <TextDetails title="Country" name={`${capCase(selected?.address1?.country) ?? ""}`} />
                                    <TextDetails title="Postal Code" name={`${capCase(selected?.address1?.postalCode) ?? ""}`} />
                                </SimpleGrid>
                                <TextDetails title="Other Data" name={`${capCase(selected?.address1?.optionalData) ?? ""}`} />
                            </Box>
                        }
                
                        {selected?.address2 &&
                            <Box borderBottom={'1px solid'} py={3}>
                                <Text fontSize={'18px'} fontWeight={500}>User Address 2</Text>
                                <SimpleGrid columns={[2, 4]} spacing={4} my={3}>
                                    <TextDetails title="Salutation" name={allCaps(selected?.address2?.salutation) ?? ""} />
                                    <TextDetails title="First Name" name={`${capCase(selected?.address2?.firstName) ?? ""}`} />
                                    <TextDetails title="Last Name" name={`${capCase(selected?.address2?.lastName) ?? ""}`} />
                                    {/* <TextDetails title="Email" name={selected?.address2?.email ?? ""} /> */}
                                    <TextDetails title="Phone Number" name={`+${selected?.address2?.phoneNumber ?? ""}`} />
                                    <TextDetails title="Phone Number 2" name={`${selected?.address2?.phoneNumber2 ?? ""}`} />
                                    <TextDetails title="Address" name={`${capCase(selected?.address2?.address) ?? ""}`} />
                                    <TextDetails title="City" name={`${capCase(selected?.address2?.city) ?? ""}`} />
                                    <TextDetails title="Country" name={`${capCase(selected?.address2?.country) ?? ""}`} />
                                    <TextDetails title="Postal Code" name={`${capCase(selected?.address2?.postalCode) ?? ""}`} />
                                </SimpleGrid>
                                <TextDetails title="Other Data" name={`${capCase(selected?.address2?.optionalData) ?? ""}`} />
                            </Box>
                        }

                        {/* <Box py={3}>
                            <Text fontSize={'18px'} fontWeight={500}>Order's Made ({formatNumberToShortForm(selected?.orders?.length ?? 0) ?? 0}) </Text>
                            <Box>
                                {selected?.orders?.length <=0 ? <Box mt={1}>No Order Yet!</Box> :
                                selected?.orders?.map((order:any, i:any) => (
                                    <SimpleGrid key={i} columns={[2, 4]} spacing={4} mt={3} py={3} borderBottom={'1px solid #ccc'}>
                                        <TextDetails title="Date" name={`${prettyDateFormat(order?.createdAt) ?? ""}`} />
                                        <TextDetails title="Order Number" name={order?.orderNumber ?? ""} />
                                        <TextDetails title="Total Amount" name={`€ ${moneyFormat(order?.totalPaid) ?? 0.0}`} />
                                        <TextDetails title="Products Amount" name={`€ ${moneyFormat(order?.productsAmount) ?? 0.0}`} />
                                        <TextDetails title="Delivery Fee" name={`€ ${moneyFormat(order?.deliveryFee) ?? 0.0}`} />
                                        <TextDetails title="Payment Method" name={`${allCaps(order?.paymentMethod) ?? ""}`} />
                                        <TextDetails title="Delivery Method" name={capCase(order?.deliveryMethod) ?? ""} />
                                        <TextDetails title="Payment Status" name={capCase(order?.paymentStatus) ?? ""} />
                                        <TextDetails title="Delivery Status" name={capCase(order?.deliveryStatus) ?? ""} />
                                    </SimpleGrid>
                                ))}
                            </Box>
                        </Box> */}

                    </Stack>
                }
            />

        </Box>
    )
}

export default function AdminUserPage() {

    const navigate = useNavigate()
    const [filters, setFilters] = useState<any>({})

    const { data: userData = {}, isLoading: userLoad } = useGetAllUsers(filters)
    const { data: users = {} } = userData

    const { isLoading, isAuthenticated, user } = useGetAuthState()
    const isAdmin = isSuperUser(user?.role)
    const isSuperAdmin = isJustSuperAdmin(user?.role)
    useEffect(() => { if(!isLoading && isAuthenticated == false) { navigate('/products/vl') } }, [isLoading, isAuthenticated])
    useEffect(() => { if(!isLoading && isAdmin == false && isAuthenticated == true ) {navigate('/profile'); Notify.error("Not Authorized!!")} }, [isLoading, isAuthenticated])
    if(isLoading) { return (<Loader />) }

    return (
        <PageMainContainer title='Users' description='Users'>
            <MainAppLayout noFooter>
                <Container>
                    <AnimateRoute>
                        <AdminUserMain 
                            isLoading={userLoad}
                            init={users}
                            users={users?.users ?? []}
                            filters={filters}
                            setFilters={setFilters}
                            isSuperAdmin={isSuperAdmin}
                        />
                    </AnimateRoute>
                </Container>
            </MainAppLayout>
        </PageMainContainer>
    )
}
