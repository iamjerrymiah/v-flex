import { useEffect, useState } from 'react'
import PageMainContainer from '../../common/PageMain'
import MainAppLayout from '../../layouts/MainAppLayout'
import AnimateRoute from '../../common/AnimateRoute'
import { Container } from '../../styling/layout'
import { Box, Button, Center, Image, Stack, Text } from '@chakra-ui/react'
import { useMollieConfirmPayment } from '../../hooks/orders/orders'
import { useNavigate, useParams } from 'react-router'
import PageSk from '../../common/PageSk'

import successPay from '../../assets/images/succssPay.png'
import failedPay from '../../assets/images/failedPay.png'



export default function MollieConfirmPage() {

    const navigate = useNavigate()
    const { orderId } = useParams<{ orderId: string; }>();
    const { mutateAsync, isPending } = useMollieConfirmPayment()

    const [data, setData] = useState<any>(null)

    const handlePay = async() => {
        try {
            const res:any = await mutateAsync({orderDataID: orderId})
            setData(res)
            return res
        } catch(e:any) { setData(e); return e; }
    }

    useEffect(() => {
        // if(!isPending) {  }
        handlePay()
    }, [])

    return (
        <PageMainContainer title='Pay' description='Pay'>
            <MainAppLayout noFooter justLogo>
                <AnimateRoute>
                    <Container>
                        <Box py={24} w='100%'>
                            {isPending ? <PageSk /> :
                                <Center>
                                    <Stack justifyContent={'center'} alignItems={'center'}>
                                        <Image 
                                            src={data?.status == 200 ? successPay: failedPay}
                                            w={250}
                                            h={250}
                                        />
                                        <Stack textAlign={'center'}>
                                            <Text fontSize={['30px']} fontWeight={700}>
                                                {data?.status == 200 ?  "Order Successful" : "Order Failed"} 
                                            </Text>
                                            <Text fontSize={[ '16px', '18px' ]} >
                                                {data?.status == 200 ? "Your order was successfully placed." : 'Order status uncertain. Please go back to confirm.'}
                                            </Text>
                                        </Stack>
                                        <Button
                                            bgColor={data?.status == 200 ? 'green.500' : 'red.500'}
                                            color={'white'}
                                            size={'md'}
                                            w={['100%', '100%']}
                                            onClick={() => navigate(`${data?.status == 200 ? '/products/vl': '/order/checkout'}`)}
                                        >
                                            {data?.status == 200 ? "Return Home" : "Back"}
                                        </Button>
                                    </Stack>
                                </Center>
                            }
                        </Box>
                    </Container>
                </AnimateRoute>
            </MainAppLayout>
        </PageMainContainer>
    )
}
