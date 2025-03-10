import { Button, Flex, Heading, HStack, PinInput, PinInputField, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react'
import PageMainContainer from '../../../common/PageMain';
import MainAppLayout from '../../../layouts/MainAppLayout';
import { Container } from '../../../styling/layout';
import AnimateRoute from '../../../common/AnimateRoute';
import { useGetAuthState, useVerifyEmail } from '../../../hooks/auth/AuthenticationHook';
import Notify from '../../../utils/notify';
import { useNavigate } from 'react-router';

function VerifyEmailMain() {

    const navigate = useNavigate()

    const [code, setCode] = useState("");
    const [countdown, setCountdown] = useState(60);

    const { user } =  useGetAuthState();

    const { mutateAsync, isPending } = useVerifyEmail();

    const handleSubmit = async (data: any) => {
        const transform = Number(data)

        try {

            const payload: any = await mutateAsync({ 
                email: user?.email, 
                code: transform 
            });
            Notify.success("Acccount Verified Successfully! Please log In")

            navigate('/login')
            return payload;
        } catch (e:any) {
            Notify.error(e?.message ?? "Failed")
            return e
        }
    };


    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    useEffect(() => { 
        if(!user || user?.emailVerified) {
            navigate('/')
        } 
    }, [user])

    return (
        <Flex 
            w={'100%'} 
            h={['100vh', 'full']}
            justify="center" 
            bg="white" 
            mt={'110px'}
            px={['0px', '0px', '0px', '50px', '280px']}
            pb={'50px'}
        >
            <Flex direction="column" mx="auto">
                <Flex direction="column" textAlign={'center'} mt={['80px', '0px']}>
                    <Heading textAlign="center" fontSize={["30px", '40px']} fontWeight={400} mb={4}> VERIFY YOUR ACCOUNT </Heading>
                    <Text fontSize={["12px", '14px']} color="gray.500">
                            We have sent a verification code to <br />
                        <Text as="span" fontWeight="bold">{user?.email}</Text> Kindly input the code
                    </Text>
                </Flex>
                

                {/* OTP Input */}
                <HStack spacing={4} mt={'30px'}>
                    <PinInput otp value={code} onChange={setCode} manageFocus>
                    {[...Array(6)].map((_, index) => (
                        <PinInputField
                            key={index}
                            w={["40px", "85px"]}
                            h={["40px", "70px"]}
                            fontSize={["xl", "2xl"]}
                            textAlign="center"
                            borderRadius="17px"
                            boxShadow="md"
                            _focus={{ backgroundColor: "blue.100", boxShadow: "outline" }}
                        />
                    ))}
                    </PinInput>
                </HStack>


                {/* <Flex justify="flex-end" mt={2} mb={4}>
                    <Text fontSize={["12px"]} color="gray.500" cursor={'pointer'}>
                        Resend code in{" "}
                        <Text as="span" fontWeight="bold" color="blue.300">
                            {countdown}
                        </Text>s
                    </Text>
                </Flex> */}

                <Button 
                    mt={6}
                    bg="black" 
                    color="white" 
                    _hover={{ bg: "gray" }}
                    w={'100%'}
                    onClick={() => handleSubmit(code)}
                    isDisabled={!code}
                    isLoading={isPending}
                >
                    CONTINUE
                </Button>
            </Flex>


        </Flex>
    )
}

export default function VerifyEmail() {
    return (
        <PageMainContainer title='Verify Email' description='Verify Email'>
            <MainAppLayout noFooter>
                <Container>
                    <AnimateRoute>
                        <VerifyEmailMain />
                    </AnimateRoute>
                </Container>
            </MainAppLayout>
        </PageMainContainer>
    )
}
