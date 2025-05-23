import PageMainContainer from '../../../common/PageMain'
import MainAppLayout from '../../../layouts/MainAppLayout'
import { Container } from '../../../styling/layout'
import AnimateRoute from '../../../common/AnimateRoute'
import { Select as ChakraSelect, Box, Button, Checkbox, Flex, FormControl, FormLabel, Grid, Heading, Input, InputGroup, InputRightElement, Stack, Text } from "@chakra-ui/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; 
import SelectComponent from "react-select";
import countryList from "react-select-country-list";
import { Link, useNavigate } from 'react-router';
// import ReCAPTCHA from "react-google-recaptcha";
import { Formik, Field, Form } from "formik";
import { registerSchema } from '../../../schema/auth';
import Notify from '../../../utils/notify';
import { useCreateUser } from '../../../hooks/auth/AuthenticationHook';


function RegisterMain () {

    const navigate = useNavigate()

    const countryOptions = countryList().getData();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { mutateAsync, isPending } = useCreateUser()

    const handleRegister = async (data: any) => {
        try {

            const payload: any = await mutateAsync({
                salutation: data?.salutation,
                firstName: data?.firstName,
                lastName: data?.lastName,
                country: data?.country,
                phoneNumber: data?.phoneNumber,
                email: data?.email,
                password: data?.password,
            });
            Notify.success("Welcome! 😊")

            navigate('/auth/verify')
            return payload;
        } catch (e:any) {
            Notify.error(e?.message ?? "Failed")
            return e
        }
    };

    return (
        <Flex 
            w={'100%'} 
            align="center" 
            justify="center" 
            bg="white" 
            px={['0px', '0px', '0px', '50px', '280px']}
            pb={'50px'}
        >
            <Box w="full">
                <Heading textAlign="center" fontSize={["30px", '40px']} fontWeight={400} mb={10}> CREATE AN ACCOUNT </Heading>
                    <Formik
                        initialValues={{
                            salutation: "",
                            firstName: "",
                            lastName: "",
                            country: "",
                            phoneNumber: "",
                            email: "",
                            confirmEmail: "",
                            password: "",
                            confirmPassword: "",
                            terms: true,
                        }}
                        validationSchema={registerSchema}
                        onSubmit={(values, actions) => {
                            // console.log("Form Submitted", values);
                            handleRegister(values)
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
                        handleSubmit, }) => (
                    <Form onSubmit={handleSubmit}>
                        <Grid templateColumns={["1fr", "1fr", "1fr", "1fr 1fr"]} gap={6}>
                            <Stack direction={['column', 'row', 'row', 'row']}>
                                <FormControl w={['100%', '150px']}>
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
                                    {errors.salutation && <Text fontSize={'12px'} color={'red.400'}>{errors.salutation}</Text>}
                                </FormControl>
                    
                                <FormControl>
                                    <FormLabel fontWeight={700}>* First Name</FormLabel>
                                    <Input
                                        name="firstName" 
                                        value={values?.firstName}
                                        onChange={handleChange}
                                        placeholder="Enter your first name" 
                                        required
                                    />
                                    {errors.firstName && <Text fontSize={'12px'} color={'red.400'}>{errors.firstName}</Text>}
                                </FormControl>
                            </Stack>
                
                            <FormControl>
                                <FormLabel fontWeight={700}>* Last Name</FormLabel>
                                <Input 
                                    name="lastName" 
                                    value={values?.lastName}
                                    onChange={handleChange} 
                                    placeholder="Enter your last name" 
                                    required
                                />
                                {errors.lastName && <Text fontSize={'12px'} color={'red.400'}>{errors.lastName}</Text>}
                            </FormControl>

                            <FormControl>
                                <FormLabel fontWeight={700}>* Country</FormLabel>
                                <SelectComponent
                                    options={countryOptions}
                                    placeholder="Select country"
                                    onChange={(option:any) => setFieldValue("country", option.label)}
                                    required
                                />
                                {errors.country && <Text fontSize={'12px'} color={'red.400'}>{errors.country}</Text>}
                            </FormControl>

                
                            <FormControl>
                                <FormLabel fontWeight={700}>* Phone Number</FormLabel>
                                <PhoneInput
                                    country={"nl"}
                                    inputStyle={{ width: "100%" }}
                                    onChange={(value) => setFieldValue("phoneNumber", value)}
                                />
                                {errors.phoneNumber && <Text fontSize={'12px'} color={'red.400'}>{errors.phoneNumber}</Text>}
                                {/* <Text fontSize="11px">Format: 333-333-3333</Text> */}
                            </FormControl>
                
                            <FormControl>
                                <FormLabel fontWeight={700}>* Email</FormLabel>
                                <Input 
                                    name="email" 
                                    value={values?.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email" 
                                    required
                                />
                                {errors.email && <Text fontSize={'12px'} color={'red.400'}>{errors.email}</Text>}
                            </FormControl>
                
                            <FormControl>
                                <FormLabel fontWeight={700}>* Confirm Email</FormLabel>
                                <Input 
                                    name="confirmEmail" 
                                    value={values?.confirmEmail}
                                    onChange={handleChange}
                                    placeholder="Enter your email again" 
                                    required
                                />
                                {errors.confirmEmail && <Text fontSize={'12px'} color={'red.400'}>{errors.confirmEmail}</Text>}
                            </FormControl>
                
                            <FormControl>
                                <FormLabel fontWeight={700}>* Password</FormLabel>
                                <InputGroup>
                                    <Input 
                                        name="password" 
                                        value={values?.password}
                                        onChange={handleChange} 
                                        type={showPassword ? "text" : "password"} 
                                        placeholder='********'
                                        required
                                    />
                                    <InputRightElement>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                                        </Button>
                                        </InputRightElement>
                                </InputGroup>
                                {errors.password && <Text fontSize={'12px'} color={'red.400'}>{errors.password}</Text>}
                                <Text fontSize="xs">8 - 255 characters</Text>
                            </FormControl>
                
                            <FormControl>
                                <FormLabel fontWeight={700}>* Confirm Password</FormLabel>
                                <InputGroup>
                                    <Input 
                                        name="confirmPassword"  
                                        value={values?.confirmPassword}
                                        onChange={handleChange}
                                        type={showConfirmPassword ? "text" : "password"} 
                                        placeholder='********'
                                        required
                                    />
                                    <InputRightElement>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                                {errors.confirmPassword && <Text fontSize={'12px'} color={'red.400'}>{errors.confirmPassword}</Text>}
                            </FormControl>
                        </Grid>
            
                        <Stack mt={'30px'} spacing={6}>
                            <Field name="terms">
                                {({ field }:any) => (
                                    <Checkbox {...field} isChecked={values.terms}>I want to be updated on fashion trends & product launches</Checkbox>
                                )}
                            </Field>
                            
                            <Text fontSize="15px" color={'gray'}>
                                By clicking "Create Account", I consent to commercial promotion activities related to V-Edition Group Brands <br />
                                by e-mail and/or text messages according to the <Link to={'#'}><Box as='span' textDecor={'underline'}>Privacy Policy. </Box></Link>   
                            </Text>
                        </Stack>

                        <Stack justify={'center'} align={'center'} mt={6} spacing={6}>
                            {/* reCAPTCHA */}
                            {/* <ReCAPTCHA sitekey="YOUR_SITE_KEY_HERE" /> */}

                            <Button 
                                bg="black" 
                                type='submit'
                                color="white" 
                                _hover={{ bg: "gray" }}
                                w={['100%', '40%']}
                                isDisabled={ isSubmitting  || isPending}
                                isLoading={isSubmitting || isPending}
                            >
                                CREATE ACCOUNT
                            </Button>
                        </Stack>
                    </Form>
                )}
                </Formik>
            </Box>
      </Flex>
    )
}

export default function Register() {
    return (
        <PageMainContainer title='Sign Up' description='Sign Up'>
            <MainAppLayout noFooter>
                <Container>
                    <AnimateRoute>
                        <RegisterMain />
                    </AnimateRoute>
                </Container>
            </MainAppLayout>
        </PageMainContainer>
    )
}
