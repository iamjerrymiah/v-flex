import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, InputGroup, InputRightElement, Stack, Text } from '@chakra-ui/react'
import { Form, Formik } from 'formik';
import { changePasswordSchema } from '../../../schema/auth';
import Notify from '../../../utils/notify';
import { useChangePassword, useGetAuthState } from '../../../hooks/auth/AuthenticationHook';
import { useNavigate } from 'react-router';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import PageMainContainer from '../../../common/PageMain';
import MainAppLayout from '../../../layouts/MainAppLayout';
import { Container } from '../../../styling/layout';
import AnimateRoute from '../../../common/AnimateRoute';
import Loader from '../../../common/Loader';
import { MdOutlineArrowBackIos } from 'react-icons/md';

function ChangePasswordMain () {

    const navigate = useNavigate()

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const { mutateAsync, isPending } = useChangePassword()
    const handleSubmit = async (data: any) => {
        try {
            const payload: any = await mutateAsync({...data});
            Notify.success("Password changed successfully")
            navigate('/profile')
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
                <Flex direction="column" textAlign={'center'} mt={['80px']} mb={4}>
                    <Heading textAlign="center" fontSize={["30px", '40px']} fontWeight={400} mb={6}>CHANGE PASSWORD </Heading>
                    {/* <Text fontSize={["16px", '20px']} color="gray.500" fontWeight="bold">
                        Please enter your new password
                    </Text> */}
                </Flex>

                <Button
                    mb={'40px'}
                    leftIcon={<MdOutlineArrowBackIos />}
                    variant="ghost"
                    onClick={() => navigate(`/profile`)}
                    textDecor={'underline'}
                >
                    Back
                </Button>

                <Formik
                    initialValues={{
                        oldPassword: "",
                        newPassword: "",
                    }}
                    validationSchema={changePasswordSchema}
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
                            <FormLabel fontWeight={700}>* Old Password</FormLabel>
                            <InputGroup>
                                <Input 
                                    name="oldPassword" 
                                    value={values?.oldPassword}
                                    onChange={handleChange} 
                                    type={showOldPassword ? "text" : "password"} 
                                    placeholder='********'
                                    required
                                />
                                <InputRightElement>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                    >
                                        {showOldPassword ? <FaEye /> : <FaEyeSlash />}
                                    </Button>
                                    </InputRightElement>
                            </InputGroup>
                            {errors.oldPassword && <Text fontSize={'12px'} color={'red.400'}>{errors.oldPassword}</Text>}
                            <Text fontSize="xs">8 - 255 characters</Text>
                        </FormControl>
            
                        <FormControl>
                            <FormLabel fontWeight={700}>* Confirm Password</FormLabel>
                            <InputGroup>
                                <Input 
                                    name="newPassword"  
                                    value={values?.newPassword}
                                    onChange={handleChange}
                                    type={showNewPassword ? "text" : "password"} 
                                    placeholder='********'
                                    required
                                />
                                <InputRightElement>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? <FaEye /> : <FaEyeSlash />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            {errors.newPassword && <Text fontSize={'12px'} color={'red.400'}>{errors.newPassword}</Text>}
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
                                SUBMIT
                            </Button>

                        </Stack>
                    </Form>
                )}
                </Formik>
            </Box>
        </Flex>
    )
}

export default function ChangePassword() {

    const navigate = useNavigate()
    const { isLoading, isAuthenticated } = useGetAuthState()
    useEffect(() => { if(!isLoading && isAuthenticated == false) { navigate('/products/vl') } }, [isLoading, isAuthenticated])
    if(isLoading) { return (<Loader />) }

    return (
        <PageMainContainer title='Change Password' description='Change Password'>
            <MainAppLayout noFooter>
                <Container>
                    <AnimateRoute>
                        <ChangePasswordMain />
                    </AnimateRoute>
                </Container>
            </MainAppLayout>
        </PageMainContainer>
    )
}
