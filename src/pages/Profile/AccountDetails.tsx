// import { useEffect } from "react";
import AnimateRoute from "../../common/AnimateRoute";
import PageMainContainer from "../../common/PageMain";
import { useGetAuthState, useUpdateUser } from "../../hooks/auth/AuthenticationHook";
import MainAppLayout from "../../layouts/MainAppLayout";
import { Container } from "../../styling/layout";
import { useNavigate } from "react-router";
import { Select as ChakraSelect, Box, Button, FormControl, FormLabel, Heading, HStack, Text, Input, SimpleGrid } from "@chakra-ui/react";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { Form, Formik } from "formik";
import { accountDetailsSchema } from "../../schema/auth";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; 
import SelectComponent from "react-select";
import countryList from "react-select-country-list";
import Notify from "../../utils/notify";


function AccountDetailMain ({ initData = {} }: any) {

    const navigate = useNavigate()
    const countryOptions = countryList().getData();

    const { mutateAsync, isPending } = useUpdateUser()

    const handleAccountDetails = async (data: any) => {
        try {

            const payload: any = await mutateAsync({
                salutation: data?.salutation,
                firstName: data?.firstName,
                lastName: data?.lastName,
                country: data?.country,
                phoneNumber: data?.phoneNumber
            })

            Notify.success("Submitted")

            return payload;
        } catch (e:any) {
            Notify.error(e?.message ?? "Failed")
            return e
        }
    };


    return (
        <Box py={6}>

            <Heading textAlign="center" fontSize={["24px", '30px']} fontWeight={400} my={10}> PERSONAL DETAILS </Heading>

            <Button
                leftIcon={<MdOutlineArrowBackIos />}
                variant="ghost"
                onClick={() => navigate(-1)}
                textDecor={'underline'}
            >
                Back
            </Button>

            <Box w={'full'} mt={6}>

                <Formik
                    initialValues={{
                        salutation: initData?.salutation ?? "",
                        firstName: initData?.firstName ?? "",
                        lastName: initData?.lastName ?? "",
                        email: initData?.email ?? "",
                        country: initData?.country ?? "",
                        phoneNumber: initData?.phoneNumber ?? "",
                    }}
                    validationSchema={accountDetailsSchema}
                    onSubmit={async (values, actions) => {
                        await handleAccountDetails(values)
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

                            <SimpleGrid columns={[ 1, 2, 3 ]} spacing={6}>

                                <FormControl>
                                    <FormLabel fontWeight={700}>* Salutation</FormLabel>
                                    <ChakraSelect 
                                        name="salutation"
                                        value={values?.salutation}
                                        onChange={handleChange}
                                        required
                                    >
                                        {["", "Mr", "Ms", "Mrs"].map((opt:any, i:number) => (
                                            <option key={i}>{opt}</option>
                                        ))}
                                    </ChakraSelect>
                                    {errors?.salutation && <Text fontSize={'12px'} color={'red.400'}>{`${errors?.salutation}`}</Text>}
                                </FormControl>

                                <FormControl>
                                    <FormLabel fontWeight={700}>* First Name</FormLabel>
                                    <Input
                                        name="firstName" 
                                        value={values?.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors?.firstName && <Text fontSize={'12px'} color={'red.400'}>{`${errors?.firstName}`}</Text>}
                                </FormControl>

                                <FormControl>
                                    <FormLabel fontWeight={700}>* Last Name</FormLabel>
                                    <Input
                                        name="lastName" 
                                        value={values?.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors?.lastName && <Text fontSize={'12px'} color={'red.400'}>{`${errors?.lastName}`}</Text>}
                                </FormControl>

                                <FormControl>
                                    <FormLabel fontWeight={700}>* Email</FormLabel>
                                    <Input 
                                        name="email" 
                                        value={values?.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email" 
                                        // required
                                        disabled
                                    />
                                    {/* {errors?.email && <Text fontSize={'12px'} color={'red.400'}>{`${errors?.email}`}</Text>} */}
                                </FormControl>

                                <FormControl>
                                    <FormLabel fontWeight={700}>* Phone Number</FormLabel>
                                    <PhoneInput
                                        country={"nl"}
                                        value={values?.phoneNumber} 
                                        inputStyle={{ width: "100%" }}
                                        onChange={(value) => setFieldValue("phoneNumber", value)}
                                    />
                                    {errors?.phoneNumber && <Text fontSize={'12px'} color={'red.400'}>{`${errors?.phoneNumber}`}</Text>}
                                </FormControl>

                                <FormControl>
                                    <FormLabel fontWeight={700}>* Country</FormLabel>
                                    <SelectComponent
                                        options={countryOptions}
                                        placeholder="Select country"
                                        value={countryOptions.find(option => option?.label === values?.country)}
                                        onChange={(option:any) => setFieldValue("country", option.label)}
                                        required
                                    />
                                    {errors?.country && <Text fontSize={'12px'} color={'red.400'}>{`${errors?.country}`}</Text>}
                                </FormControl>

                            </SimpleGrid>

                            <HStack w={'full'} justify={'flex-end'} mt={12}>
                                <Button 
                                    bg="black" 
                                    type='submit'
                                    color="white" 
                                    _hover={{ bg: "gray" }}
                                    w={['100%', '20%']}
                                    isDisabled={ isSubmitting  || isPending}
                                    isLoading={isSubmitting || isPending}
                                >
                                    Submit
                                </Button>
                                
                            </HStack>
                            
                        </Form>
                    )}
                </Formik>

            </Box>

        </Box>
    )
}

export default function AccountDetails() {

    // const navigate = useNavigate()
    const { user } =  useGetAuthState();
    
    // useEffect(() => { 
    //     if(!isAuthenticated) {
    //         navigate(-1)
    //     } 
    // }, [isAuthenticated, user])

    return (
        <PageMainContainer title='Account Details' description='Account Details'>
            <MainAppLayout noFooter>
                <Container>
                    <AnimateRoute>
                        <AccountDetailMain 
                            initData={user}
                        />
                    </AnimateRoute>
                </Container>
            </MainAppLayout>
        </PageMainContainer>
    )
}
