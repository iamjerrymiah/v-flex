import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, InputGroup, InputRightElement, Stack, Text } from '@chakra-ui/react'
import PageMainContainer from '../../../common/PageMain'
import MainAppLayout from '../../../layouts/MainAppLayout'
import { Container } from '../../../styling/layout'
import AnimateRoute from '../../../common/AnimateRoute'
import { Form, Formik } from 'formik'
import { resetPasswordSchema } from '../../../schema/auth'
import { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router';
import Notify from '../../../utils/notify'
import { useResetPassword } from '../../../hooks/auth/AuthenticationHook'

function ResetPasswordMain() {
    
    const navigate = useNavigate()

    const { id, token } = useParams<{ id: string; token: string }>();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { mutateAsync, isPending } = useResetPassword()

    const handleSubmit = async (data: any) => {
        try {
            const payload: any = await mutateAsync({
                userId: id,
                password: data?.password,
                token: token
            });
            Notify.success("Success")
            navigate('/login')
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
            <Box w={'full'}>
                <Flex direction="column" textAlign={'center'} mt={['80px']} mb={'40px'}>
                    <Heading textAlign="center" fontSize={["30px", '40px']} fontWeight={400} mb={6}>RESET YOUR PASSWORD </Heading>
                    <Text fontSize={["16px", '20px']} color="gray.500" fontWeight="bold">
                        Please enter your new password <br />
                        {/* <Text fontSize={["14px", '16px']} as="span"></Text>  */}
                    </Text>
                </Flex>

                <Formik
                    initialValues={{
                        password: "",
                        confirmPassword: "",
                    }}
                    validationSchema={resetPasswordSchema}
                    onSubmit={(values, actions) => {
                        handleSubmit(values)
                        actions.setSubmitting(false); 
                    }}
                >
                {({                         
                    handleChange,
                    values,
                    isSubmitting,
                    errors,
                    handleSubmit, }) => (

                    <Form onSubmit={handleSubmit}>
                        <FormControl mb={4}>
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

                        <Stack mt={6} direction={'row'}>
                            <Button 
                                bg="black" 
                                type="submit"
                                color="white" 
                                _hover={{ bg: "gray" }}
                                w={'100%'}
                                isLoading={isSubmitting || isPending}
                                isDisabled={isSubmitting || isPending}
                            >
                                CONTINUE
                            </Button>

                        </Stack>
                    </Form>
                )}
                </Formik>
            </Box>
        </Flex>
    )
}

export default function ResetPassword() {
    return (
        <PageMainContainer title='Reset Password' description='Reset Password'>
            <MainAppLayout noFooter>
                <Container>
                    <AnimateRoute>
                        <ResetPasswordMain />
                    </AnimateRoute>
                </Container>
            </MainAppLayout>
        </PageMainContainer>
    )
}
