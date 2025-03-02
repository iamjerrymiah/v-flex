import { Box, Button, Divider, Flex, FormControl, Grid, Heading, Input, InputGroup, InputRightElement, Stack, Text, VStack } from "@chakra-ui/react";
import { FaEye, FaEyeSlash, FaFacebook, FaGoogle } from "react-icons/fa";
import { useState } from "react";
import PageMainContainer from "../../../common/PageMain";
import { Container } from "../../../styling/layout";
import MainAppLayout from "../../../layouts/MainAppLayout";
import AnimateRoute from "../../../common/AnimateRoute";
import { Link, useLocation, useNavigate } from "react-router";
import { loginSchema } from "../../../schema/auth";
import { Form, Formik } from "formik";
import Notify from "../../../utils/notify";
import { useLogin } from "../../../hooks/auth/AuthenticationHook";

function LoginMain() {

    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Get query parameters
    const searchParams = new URLSearchParams(location.search);
    const redirect = searchParams.get("redirect");

    const onSuccess = () => {
        if (redirect) {
            navigate(redirect);
        } else {
            navigate("/");
        }
    };

    const { mutateAsync } = useLogin();


    const handleLogin = async (data: any) => {
        try {

            const payload: any = await mutateAsync(data);
            Notify.success("Login Successful!")
            onSuccess()

            return payload;
        } catch (e:any) {

            if (e) {
                e.hasError = true;
                e.status = e.statusCode;
            }
            if(e.statusCode == 422)
            {
                Notify.error(e?.message ?? "Failed")
            } else if([400, 403, 404, 500].includes(e.statusCode)) 
            {
                Notify.error("Incorrect Credentials")
            }

            return e
        }
    };

    return (
        <Flex 
            w={'100%'} 
            h={['100vh', 'full']}
            justify="center" 
            bg="white" 
            mt={'110px'}
            px={['0px', '0px', '0px', '30px']}
            pb={'50px'}
        >
            <Box w="full">
                <Heading textAlign="center" fontSize={["30px", '40px']} fontWeight={400} mb={10}>
                    REGISTER OR SIGN IN
                </Heading>
    
                <Grid
                    templateColumns={["1fr", "1fr", "1fr", "1fr auto 1fr auto 1fr"]}
                    alignItems="center"
                    gap={14}
                >

                    <VStack color={'black'} align="start" spacing={4} >
                        <Text fontWeight={650} fontSize={'18px'}>NEW CUSTOMER?</Text>
                        <Text>Register now <br />and make the most of My Account:</Text>
                        <Stack spacing={'-1'} fontSize="sm">
                            <Text>• Receive our exclusive newsletter</Text>
                            <Text>• Save your favourite products</Text>
                            <Text>• Shop faster and check your orders and returns</Text>
                        </Stack>
                        <Button 
                            w='100%' 
                            bg="black" 
                            color="white" 
                            _hover={{ bg: "gray" }}
                            onClick={() => navigate('/register')}
                        >
                            CREATE AN ACCOUNT
                        </Button>
                    </VStack>
        
                    <Divider orientation="vertical" borderLeft={'1px solid gray'} display={{ base: "none", md: "block" }} />
        
                    <VStack color={'black'} align="start" spacing={2} mt={['0px', '0px', '0px', '-50px']}>
                        <Text fontWeight={650} fontSize={'18px'}>SAVE YOUR TIME</Text>
                        <Text textAlign="center">
                            Connect with your existing social network account
                        </Text>
                        <Stack spacing={3} w="full" mt={4}>
                            <Button 
                                leftIcon={<FaFacebook size={24}/>} 
                                bg="black" 
                                color="white" 
                                _hover={{ bg: "gray" }} 
                                w="full"
                            >
                                FACEBOOK
                            </Button>
                            <Button 
                                leftIcon={<FaGoogle size={24}/>} 
                                bg="black" 
                                color="white" 
                                _hover={{ bg: "gray" }} 
                                w="full"
                            >
                                GOOGLE
                            </Button>
                        </Stack>
                    </VStack>
        
                    <Divider orientation="vertical" borderLeft={'1px solid gray'} display={{ base: "none", md: "block" }} />
        
                    <Formik
                        initialValues={{
                            email: "",
                            password: "",
                        }}
                        validationSchema={loginSchema}
                        onSubmit={(values, actions) => {
                            // console.log("Form Submitted", values);
                            handleLogin(values)
                            actions.setSubmitting(false); 
                        }}
                    >
                    {({                         
                        handleChange,
                        values,
                        isSubmitting,
                        // touched,
                        errors,
                        handleSubmit, }) => (

                        <Form onSubmit={handleSubmit}>
                            <VStack align="start" spacing={4} w="full">
                                <Text fontWeight={650} fontSize={'18px'}>SIGN IN</Text>

                                
                                <Stack spacing={4} w="full">
                                    <FormControl>
                                        <Input 
                                            name="email" 
                                            value={values?.email}
                                            onChange={handleChange}
                                            placeholder="Your Email" 
                                            required
                                        />
                                        {errors.email && <Text fontSize={'10px'} color={'red.400'}>{errors.email}</Text>}
                                    </FormControl>

                                    <FormControl>
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
                                        {errors.password && <Text fontSize={'10px'} color={'red.400'}>{errors.password}</Text>}
                                    </FormControl>

                                    <Button 
                                        bg="black" 
                                        type="submit"
                                        color="white" 
                                        _hover={{ bg: "gray" }}
                                        isLoading={isSubmitting}
                                    >
                                        LOGIN
                                    </Button>
                                    <Link to={"/auth/forgot-password"}>
                                        <Box
                                            color="black" 
                                            fontSize="14px" 
                                            textDecor={'underline'}
                                        >
                                            Forgot your password?
                                        </Box>
                                        
                                    </Link>

                                </Stack>

                            </VStack>
                        </Form>
                    )}
                    </Formik>
                    
                </Grid>
            </Box>
      </Flex>
    )
}

export default function Login() {
    return (
        <PageMainContainer title='Log In' description='Log In'>
            <MainAppLayout noFooter>
                <Container>
                    <AnimateRoute>
                        <LoginMain />
                    </AnimateRoute>
                </Container>
            </MainAppLayout>
        </PageMainContainer>
    )
}
