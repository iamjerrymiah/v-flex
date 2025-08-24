import { Select as ChakraSelect, Box, Button, FormControl, FormLabel, Heading, HStack, useDisclosure, Text, Stack, Checkbox } from "@chakra-ui/react";
import AnimateRoute from "../../common/AnimateRoute";
import PageMainContainer from "../../common/PageMain";
import MainAppLayout from "../../layouts/MainAppLayout";
import { Container } from "../../styling/layout";
import { MdAddToPhotos, MdOutlineArrowBackIos } from "react-icons/md";
import { useNavigate } from "react-router";
import { useAddUserAddress, useDeleteUserAddress, useGetUserAddresses, useUpdateUserAddress } from "../../hooks/profile/account";
import { Table, TableRow } from "../../common/Table/Table";
import { allCaps, capCase } from "../../utils/utils";
import ModalCenter from "../../common/ModalCenter";
import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { addressSchema } from "../../schema/auth";
import Notify from "../../utils/notify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; 
import SelectComponent from "react-select";
import countryList from "react-select-country-list";
import { useConfirmAction } from "../../utils/useActions";
import ConfirmModal from "../../common/ConfirmModal";
import { useGetAuthState } from "../../hooks/auth/AuthenticationHook";
import Loader from "../../common/Loader";
import { SecureFormikInput } from "../../common/SecureFormikInput";


function AddressBookForm ({ initData = {}, edit, onClose }: any) {

    const countryOptions = countryList().getData();

    const { mutateAsync, isPending } = useAddUserAddress()
    const { mutateAsync: updateAddressAction, isPending: updatePending } = useUpdateUserAddress()

    const handleAddressBook = async (data: any) => {
        try {
            const payload: any = edit ? await updateAddressAction({addressId: initData?._id, ...data}) : await mutateAsync({...data})
            Notify.success("Done")
            onClose()
            return payload;
        } catch (e:any) {
            Notify.error(e?.message ?? "Failed")
            return e
        }
    };

    return (
        <Box w={'full'}>
            <Formik
                initialValues={{
                    salutation: initData?.salutation ?? "",
                    firstName: initData?.firstName ?? "",
                    lastName: initData?.lastName ?? "",
                    address: initData?.address ?? "",
                    city: initData?.city ?? "",
                    country: initData?.country ?? "",
                    postalCode: initData?.postalCode ?? "",
                    phoneNumber: initData?.phoneNumber ?? "",
                    phoneNumber2: initData?.phoneNumber2 ?? "",
                    optionalData: initData?.optionalData ?? "",
                    defaultAddress: initData?.defaultAddress ?? false,
                }}
                validationSchema={addressSchema}
                onSubmit={async (values, actions) => {
                    await handleAddressBook(values)
                    actions.setSubmitting(false); 
                }}
            >
                {({                         
                    handleChange,
                    values,
                    isSubmitting,
                    // touched,
                    errors,
                    setFieldValue,
                    handleSubmit, 
                }) => (

                    <Form onSubmit={handleSubmit}>

                        <Stack spacing={6}>

                            <FormControl>
                                <FormLabel>* Salutation</FormLabel>
                                <ChakraSelect 
                                    name="salutation"
                                    value={capCase(values?.salutation)}
                                    onChange={handleChange}
                                    // border={errors?.salutation ? '1px solid red.400' : ""}
                                    required
                                >
                                    {["", "Mr", "Ms", "Mrs"].map((opt:any, i:number) => (
                                        <option key={i}>{opt}</option>
                                    ))}
                                </ChakraSelect>
                                {errors?.salutation && <Text fontSize={'12px'} color={'red.400'}>{`${errors?.salutation}`}</Text>}
                            </FormControl>

                            <FormControl>
                                <FormLabel>* First Name</FormLabel>
                                <SecureFormikInput
                                    name="firstName" 
                                    value={values?.firstName}
                                    onChange={handleChange}
                                    required
                                />
                                {errors?.firstName && <Text fontSize={'12px'} color={'red.400'}>{`${errors?.firstName}`}</Text>}
                            </FormControl>

                            <FormControl>
                                <FormLabel>* Last Name</FormLabel>
                                <SecureFormikInput
                                    name="lastName" 
                                    value={values?.lastName}
                                    onChange={handleChange}
                                    required
                                />
                                {errors?.lastName && <Text fontSize={'12px'} color={'red.400'}>{`${errors?.lastName}`}</Text>}
                            </FormControl>

                            <FormControl>
                                <FormLabel>* Phone Number</FormLabel>
                                <PhoneInput
                                    country={"nl"}
                                    value={values?.phoneNumber} 
                                    inputStyle={{ width: "100%" }}
                                    onChange={(value) => setFieldValue("phoneNumber", value)}
                                />
                                {errors?.phoneNumber && <Text fontSize={'12px'} color={'red.400'}>{`${errors?.phoneNumber}`}</Text>}
                            </FormControl>

                            <FormControl>
                                <FormLabel>Phone Number 2</FormLabel>
                                <PhoneInput
                                    country={"nl"}
                                    value={values?.phoneNumber2} 
                                    inputStyle={{ width: "100%" }}
                                    onChange={(value) => setFieldValue("phoneNumber2", value)}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>* Address</FormLabel>
                                <SecureFormikInput
                                    name="address" 
                                    value={values?.address}
                                    onChange={handleChange}
                                    required
                                />
                                {errors?.address && <Text fontSize={'12px'} color={'red.400'}>{`${errors?.address}`}</Text>}
                            </FormControl>

                            <FormControl>
                                <FormLabel>* City</FormLabel>
                                <SecureFormikInput
                                    name="city" 
                                    value={values?.city}
                                    onChange={handleChange}
                                    required
                                />
                                {errors?.city && <Text fontSize={'12px'} color={'red.400'}>{`${errors?.city}`}</Text>}
                            </FormControl>

                            <FormControl>
                                <FormLabel>* Country</FormLabel>
                                <SelectComponent
                                    options={countryOptions}
                                    placeholder="Select country"
                                    value={countryOptions.find(option => option?.label === values?.country)}
                                    onChange={(option:any) => setFieldValue("country", option.label)}
                                    required
                                />
                                {errors?.country && <Text fontSize={'12px'} color={'red.400'}>{`${errors?.country}`}</Text>}
                            </FormControl>

                            <FormControl>
                                <FormLabel>* Postal Code</FormLabel>
                                <SecureFormikInput
                                    name="postalCode" 
                                    value={values?.postalCode}
                                    onChange={handleChange}
                                    required
                                />
                                {errors?.postalCode && <Text fontSize={'12px'} color={'red.400'}>{`${errors?.postalCode}`}</Text>}
                            </FormControl>

                            <FormControl>
                                <FormLabel>Additional Info</FormLabel>
                                <SecureFormikInput
                                    name="optionalData" 
                                    value={values?.optionalData}
                                    onChange={handleChange}
                                />
                                {errors?.optionalData && <Text fontSize={'12px'} color={'red.400'}>{`${errors?.optionalData}`}</Text>}
                            </FormControl>

                        </Stack>

                        <Stack mt={'20px'}>
                            <Field name="defaultAddress">
                                {({ field }:any) => (
                                    <Checkbox {...field} isChecked={values?.defaultAddress}>Is this address default ?</Checkbox>
                                )}
                            </Field>
                                                        
                        </Stack>

                        <HStack w={'full'} justify={'space-between'} spacing={3} mt={12}>
                            <Button 
                                w={'100%'} 
                                bg="gray" 
                                onClick={onClose}
                            > 
                                Back 
                            </Button>
                            <Button 
                                w={'100%'}
                                // bg="blue.700" 
                                colorScheme="facebook"
                                type='submit'
                                color="white" 
                                isDisabled={ isSubmitting  || edit ? updatePending : isPending}
                                isLoading={ isSubmitting || edit ? updatePending : isPending}
                            >
                                Save
                            </Button>
                            
                        </HStack>

                    </Form>
                )}
            </Formik>
        </Box>
    )
}

const tableHeads = [ "S/N", "Salutation", "First Name", "Last Name", "Phone Number", "Postal Code", "Is default",  "Address", ""]
function MyAddressBookMain ({ addressBooks = [], isLoading = false }: any) {

    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure()
    
    const { openConfirm, closeConfirm, isOpenConfirm, current } = useConfirmAction()

    const { mutateAsync: deleteAddressAction } = useDeleteUserAddress()

    const [selected, setSelected] = useState({})

    const selectedInfo = (d: any) => {
        setSelected(d)
        onOpenEdit()
    }

    const shouldDelete = (data: any) => {
        openConfirm(data)
    }

    const handleDelete = async () => {
        try {
            const res:any =  await deleteAddressAction({addressId: current?._id})
            Notify.success("Deleted")
            return res;
        } catch(e:any) {
            Notify.error(e?.message ?? "Failed")
            return e
        }
    }
    

    return (
        <Box py={6}>

            <Heading textAlign="center" fontSize={["24px", '30px']} fontWeight={400} my={10}> ADDRESS BOOK </Heading>

            <HStack justify={'space-between'} w={'100%'} my={4}>
                <Button
                    leftIcon={<MdOutlineArrowBackIos />}
                    variant="ghost"
                    onClick={() => navigate(`/profile`)}
                    textDecor={'underline'}
                >
                    Back
                </Button>

                {addressBooks?.length < 3 &&
                    <Button
                        leftIcon={<MdAddToPhotos />}
                        onClick={onOpen}
                        color={'white'}
                        // bgColor={'blue.700'}
                        colorScheme="facebook"
                    >
                        Add
                    </Button>
                }

            </HStack>

            <Table
                headings={tableHeads}
                loading={isLoading}
                isEmpty={addressBooks?.length <= 0}
                emptyText='No address book found'
                pt={3}
                noIndexPad
            >
                {addressBooks?.map((item:any, index:any) =>
                    <TableRow
                        key={index}
                        data={[
                            (index + 1 ),
                            allCaps(item?.salutation ?? "-"),
                            capCase(item?.firstName ?? "-"),
                            capCase(item?.lastName ?? "-"),
                            `+${item?.phoneNumber}`,
                            // `+${item?.phoneNumber2}`,
                            item?.postalCode ?? "-",
                            item?.defaultAddress == true ? "Yes" : "No",
                            `${capCase(item?.address)}, ${capCase(item?.city)}, ${capCase(item?.country)}`,
                        ]}
                        noIndexPad
                        options={[
                            {name: "View", onUse: () => {selectedInfo(item)}},
                            {name: "Delete", color: 'red.700', onUse: () => shouldDelete(item)},
                        ]}
                    />
                )}
            </Table>

            <ModalCenter 
                isOpen={isOpen}
                onClose={onClose}
                header='Add Address Book'
                body={
                    <AddressBookForm 
                        onClose={onClose}
                        initData={{}}
                    />
                }
            />

            <ModalCenter 
                isOpen={isOpenEdit}
                onClose={onCloseEdit}
                header='View Address Book'
                body={
                    <AddressBookForm 
                        edit
                        onClose={onCloseEdit}
                        initData={selected}
                    />
                }
            />

            <ConfirmModal
                isOpen={isOpenConfirm}
                onConfirm={handleDelete}
                onClose={closeConfirm}
            />

        </Box>
    )
}


export default function MyAddressBook() {

    const navigate = useNavigate()

    const { data: addressBookData = {}, isLoading: addressLoad } = useGetUserAddresses({})
    const { data: addressBooks = [] } = addressBookData

    const { isLoading, isAuthenticated } = useGetAuthState()
    useEffect(() => { if(!isLoading && isAuthenticated == false) { navigate('/products/vl') } }, [isLoading, isAuthenticated])
    if(isLoading) { return (<Loader />) }

    return (
        <PageMainContainer title='Address Book' description='Address Book'>
            <MainAppLayout noFooter>
                <Container>
                    <AnimateRoute>
                        <MyAddressBookMain 
                            isLoading={addressLoad}
                            addressBooks={addressBooks}
                        />
                    </AnimateRoute>
                </Container>
            </MainAppLayout>
        </PageMainContainer>
    )
}
