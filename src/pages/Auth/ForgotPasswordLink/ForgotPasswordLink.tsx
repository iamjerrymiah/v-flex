import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Stack, Text } from '@chakra-ui/react'
import { forgotPasswordSchema } from '../../../schema/auth';
import { Form, Formik } from 'formik';
import PageMainContainer from '../../../common/PageMain';
import MainAppLayout from '../../../layouts/MainAppLayout';
import { Container } from '../../../styling/layout';
import AnimateRoute from '../../../common/AnimateRoute';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { useGetAuthState, useResetPasswordLink } from '../../../hooks/auth/AuthenticationHook';
import Notify from '../../../utils/notify';

function ForgotPasswordLinkMain() {

    const navigate = useNavigate()

    const { user } =  useGetAuthState();
    
    const { mutateAsync, isPending } = useResetPasswordLink();

    const handleSubmit = async (data: any) => {

        try {

            const payload: any = await mutateAsync(data);
            Notify.success("A reset link has been sent to your email")

            // navigate('/login')
            return payload;
        } catch (e:any) {
            Notify.error(e?.message ?? "Failed")
            return e
        }
    };

    useEffect(() => { 
        if(user) {
            navigate('/')
        } 
    }, [user])
    
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
                    <Heading textAlign="center" fontSize={["30px", '40px']} fontWeight={400} mb={6}>FORGOT YOUR PASSWORD? </Heading>
                    <Text fontSize={["16px", '20px']} color="gray.500" fontWeight="bold">
                        Request to Reset Your Password <br />
                        <Text fontSize={["14px", '16px']} as="span">Please enter your email address below. You will receive a link to reset your password.</Text> 
                    </Text>
                </Flex>

                <Formik
                    initialValues={{
                        email: "",
                    }}
                    validationSchema={forgotPasswordSchema}
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
                        <FormControl>
                            <FormLabel fontWeight={700}>* Email</FormLabel>
                            <Input 
                                name="email" 
                                value={values?.email}
                                onChange={handleChange}
                                required
                            />
                            {errors.email && <Text fontSize={'12px'} color={'red.400'}>{errors.email}</Text>}
                        </FormControl>

                        <Stack mt={6} direction={'row'}>
                            <Button 
                                colorScheme='facebook'
                                type="submit"
                                color="white" 
                                // _hover={{ bg: "gray" }}
                                w={'100%'}
                                isLoading={isSubmitting || isPending}
                                isDisabled={isSubmitting || isPending}
                            >
                                SEND
                            </Button>

                            <Button 
                                bg="gray" 
                                color="white" 
                                _hover={{ bg: "gray.100" }}
                                w={'100%'}
                                onClick={() => navigate('/login')}
                            >
                                BACK
                            </Button>

                        </Stack>
                    </Form>
                )}
                </Formik>
            </Box>
        </Flex>
    )
}


export default function ForgotPasswordLink() {
    return (
        <PageMainContainer title='Forgot Password' description='Forgot Password'>
            <MainAppLayout noFooter justLogo>
                <Container>
                    <AnimateRoute>
                        <ForgotPasswordLinkMain />
                    </AnimateRoute>
                </Container>
            </MainAppLayout>
        </PageMainContainer>
    )
}
