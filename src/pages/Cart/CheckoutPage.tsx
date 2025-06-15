import { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Button,
  Divider,
  RadioGroup,
  Skeleton,
  SimpleGrid,
  Spinner,
} from '@chakra-ui/react';
import { FaCcVisa, FaUniversity, FaCcPaypal, FaIdeal } from 'react-icons/fa';
import PageMainContainer from "../../common/PageMain";
import MainAppLayout from "../../layouts/MainAppLayout";
import AnimateRoute from "../../common/AnimateRoute";
import { Container } from "../../styling/layout";
import { useGetUserCarts } from "../../hooks/user/users";
import { allCaps, capCase, moneyFormat } from '../../utils/utils';
import { useGetUserAddresses } from '../../hooks/profile/account';
import EmptyListHero from '../../common/EmptyListHero';
import { withImg } from '../Products/AdminProductPage';
import Notify from '../../utils/notify';
import { usePaymentWithMollie, useValidateOrder } from '../../hooks/orders/orders';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import { useNavigate } from 'react-router';

const Load = () => {
    return (
        <Box w='full' borderRadius='md'>
            <Skeleton borderRadius='md' h='30px' mb={2} />
            <Skeleton borderRadius='md' h='30px' mb={2}/>
            <Skeleton borderRadius='md' h='30px' mb={2}/>
        </Box>
    )
}


function CheckoutMain ({carts = [], addressBooks = [], cartLoad, addressLoad}: any) {

    // const { user, isLoading: userLoad } =  useGetAuthState();

    const navigate = useNavigate()
    const [selectedAddressId, setSelectedAddressId] = useState<number>(
        addressBooks?.find((addr:any) => addr.defaultAddress)?._id ?? addressBooks[0]?._id
    );
    const [deliveryMethod, setDeliveryMethod] = useState<'door delivery' | 'pick up'>('door delivery');
    const [paymentMethod, setPaymentMethod] = useState<'creditcard' | 'banktransfer' | 'paypal' | 'ideal'>('creditcard');

    // const selectedAddress = addressBooks?.find((addr:any) => addr._id === selectedAddressId);

    useEffect(() => {
        if(!addressLoad) {setSelectedAddressId(addressBooks?.find((addr:any) => addr.defaultAddress)?._id ?? addressBooks[0]?._id)}
    }, [addressLoad])

    const subtotal = carts?.reduce((acc:any, item:any) => acc + item?.product?.price * item?.quantity, 0);
    // const tax = subtotal * 0.07; //tax
    const total = subtotal;

    const [pay, setPay] = useState<any>(null)

    const { mutateAsync, isPending} = useValidateOrder()
    const { mutateAsync: paymentWithMollieAction, isPending: mollieLoad} = usePaymentWithMollie()

    const handleMolliePay = async (orderId: any) => {
        try {
            const mollieRes: any = await paymentWithMollieAction({ orderDataID: orderId });

            if (mollieRes?.data?.paymentUrl) {
                window.location.href = mollieRes.data.paymentUrl;
            } else {
                // If no paymentUrl, treat as error
                Notify.error("Something went wrong! Please try again.")
                // throw new Error(mollieRes?.message || "Payment URL not available.");
                // window.open(mollieRes.data.paymentUrl, '_blank', 'noopener,noreferrer');
            }

            return mollieRes;
        } catch (e: any) {
            // Try to get deep error message
            Notify.error("The payment method is not currently available");
            return e;
        }
    }

    const handleValidateOrder = async () => {
        try {
            const res:any =  await mutateAsync({ 
                address: selectedAddressId, 
                paymentMethod: paymentMethod,
                deliveryMethod: deliveryMethod,
                // coupon 
            })
            if(res) { setPay(res) }
            return res;
        } catch(e:any) {
            Notify.error(e?.message ?? "Failed")
            return e
        }
    }

    useEffect(() => { if(pay?.data?._id) { handleMolliePay(pay?.data?._id) } }, [pay?.data?._id])


    return (
        <Box py={6}>

            {isPending ?
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

            <Button
                leftIcon={<MdOutlineArrowBackIos />}
                variant="ghost"
                onClick={() => navigate(`/products/vl`)}
                mt={4}
                mb={4}
                textDecor={'underline'}
            >
                Back
            </Button>

            <Flex direction={['column', 'column', 'column', 'row']} gap={8}>
            {/* Left Section */}
                <VStack spacing={6} flex={1}>

                    {/* Customer Address */}
                    <Box w="full" p={4} borderWidth="1px" borderRadius="lg">
                        <Text fontWeight="bold" mb={4}>1. CUSTOMER ADDRESS</Text>
                        <VStack spacing={4} align="stretch">
                            {addressLoad ? <Load /> :
                            addressBooks?.length <=0 ? <EmptyListHero w='120px' h='120px' text="You don't have any address" link='/profile/address-book' linkName='Add Address'/> :
                            addressBooks?.map((address:any) => (
                                <Box
                                    key={address._id}
                                    p={4}
                                    borderWidth="2px"
                                    borderColor={selectedAddressId === address._id ? 'blue.400' : 'gray.200'}
                                    borderRadius="md"
                                    cursor="pointer"
                                    _hover={{ borderColor: 'blue.300' }}
                                    onClick={() => setSelectedAddressId(address._id)}
                                >
                                    <Text fontWeight="medium">{capCase(`${address?.salutation} ${address?.firstName} ${address?.lastName}`)}</Text>
                                    <Text fontSize="sm" color="gray.600">{capCase(`${address?.address} ${address?.city}, ${address?.country}`)}</Text>
                                    {address?.defaultAddress && (
                                        <Text fontSize="xs" color="green.500" fontWeight="bold" mt={1}>
                                            Default Address
                                        </Text>
                                    )}
                                </Box>
                            ))}
                        </VStack>
                    </Box>

                    {/* Delivery Details */}
                    <Box w="full" p={4} borderWidth="1px" borderRadius="lg">
                        <Text fontWeight="bold" mb={4}>2. DELIVERY DETAILS</Text>

                        <RadioGroup value={deliveryMethod} onChange={(val) => setDeliveryMethod(val as any)}>
                            <SimpleGrid spacing={4} columns={2}>
                                <Box borderWidth="1px" borderRadius="md" p={3} onClick={() => setDeliveryMethod('door delivery')}>
                                    <label>
                                        <input type="radio" value="door" checked={deliveryMethod === 'door delivery'} onChange={() => setDeliveryMethod('door delivery')} style={{ marginRight: 8 }} />
                                            Door Delivery 
                                            {/* <Text fontSize="sm">Between 28 May and 30 May</Text> */}
                                    </label>
                                </Box>

                                <Box borderWidth="1px" borderRadius="md" p={3} onClick={() => setDeliveryMethod('pick up')}>
                                    <label>
                                        <input type="radio" value="pickup" checked={deliveryMethod === 'pick up'} onChange={() => setDeliveryMethod('pick up')} style={{ marginRight: 8 }} />
                                        Pickup Station 
                                        {/* <Text fontSize="sm">Between 27 May and 28 May</Text> */}
                                    </label>
                                </Box>
                            </SimpleGrid>
                        </RadioGroup>

                        <Box w="full" borderWidth="1px" borderRadius="md" px={3} py={6} mt={4}>
                            {cartLoad ? <Load /> :
                            carts?.length <=0 ? <EmptyListHero w='120px' h='120px' text='No product item available'/> :
                            carts?.map((item:any, i:any) => (
                                <HStack key={i} justifyContent="space-between" px={3}>
                                    {withImg(item?.product?.name, item?.product?.mainImage)}
                                    <Text>QTY: {item.quantity}</Text>
                                </HStack>
                            ))}
                        </Box>
                    </Box>

                    {/* Payment Method */}
                    <Box w="full" p={4} borderWidth="1px" borderRadius="lg">
                        <Text fontWeight="bold" mb={4}>3. PAYMENT METHOD</Text>

                        <RadioGroup value={paymentMethod} onChange={(val) => setPaymentMethod(val as any)}>
                            <SimpleGrid columns={[2,2,2,4]} spacing={4}>
                                <Box borderWidth="1px" borderRadius="md" p={3} display="flex" alignItems="center" cursor="pointer" onClick={() => setPaymentMethod('creditcard')}>
                                    <input type="radio" value="card" checked={paymentMethod === 'creditcard'} onChange={() => setPaymentMethod('creditcard')} style={{ marginRight: 8 }} />
                                    <HStack spacing={3}>
                                        <FaCcVisa size={24} />
                                        <Text>Pay with Card</Text>
                                    </HStack>
                                </Box>

                                <Box borderWidth="1px" borderRadius="md" p={3} display="flex" alignItems="center" cursor="pointer" onClick={() => setPaymentMethod('banktransfer')}>
                                    <input type="radio" value="bank" checked={paymentMethod === 'banktransfer'} onChange={() => setPaymentMethod('banktransfer')} style={{ marginRight: 8 }} />
                                    <HStack spacing={3}>
                                        <FaUniversity size={24} />
                                        <Text>Bank Transfer</Text>
                                    </HStack>
                                </Box>

                                <Box borderWidth="1px" borderRadius="md" p={3} display="flex" alignItems="center" cursor="pointer" onClick={() => setPaymentMethod('paypal')}>
                                    <input type="radio" value="cash" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} style={{ marginRight: 8 }} />
                                    <HStack spacing={3}>
                                        <FaCcPaypal size={24} />
                                        <Text>Paypal</Text>
                                    </HStack>
                                </Box>

                                <Box borderWidth="1px" borderRadius="md" p={3} display="flex" alignItems="center" cursor="pointer" onClick={() => setPaymentMethod('ideal')}>
                                    <input type="radio" value="cash" checked={paymentMethod === 'ideal'} onChange={() => setPaymentMethod('ideal')} style={{ marginRight: 8 }} />
                                    <HStack spacing={3}>
                                        <FaIdeal size={24} />
                                        <Text>IDEAL</Text>
                                    </HStack>
                                </Box>
                            </SimpleGrid>
                        </RadioGroup>
                    </Box>

                </VStack>

                {/* Right Section: Order Summary */}
                <Box
                    w={{ base: 'full', sm: 'full', md: 'full', lg: '350px' }}
                    borderRadius="lg"
                    p={4}
                    bg="white"
                >
                    <Text fontWeight="bold" mb={4}>Order Summary</Text>

                    <VStack spacing={2} align="stretch">
                        <Flex justify="space-between" mb={2}>
                            <Text>Delivery Method</Text>
                            <Text>{capCase(deliveryMethod)}</Text>
                        </Flex>
                        <Flex justify="space-between" mb={2}>
                            <Text>Payment Method</Text>
                            <Text>{allCaps(paymentMethod == 'creditcard' ? 'Card' : paymentMethod == 'banktransfer' ? 'Transfer' : paymentMethod)}</Text>
                        </Flex>
                        <Flex justify="space-between" mb={2}>
                            <Text>Subtotal</Text>
                            <Text>€ {moneyFormat(subtotal)}</Text>
                        </Flex>
                        <Flex justify="space-between" mb={2}>
                            <Text>Delivery Fee</Text>
                            <Text>€ {moneyFormat(0)}</Text>
                        </Flex>
                        <Divider my={3} />
                        <Flex justify="space-between" fontWeight="bold" fontSize="lg">
                            <Text>Total</Text>
                            <Text>€ {moneyFormat(total)}</Text>
                        </Flex>
                
                        <Button 
                            mt={6}
                            w="full" 
                            bg="black" 
                            color="white" 
                            _hover={{ bg: "gray.700" }} 
                            isDisabled={carts?.length === 0}
                            isLoading={isPending || mollieLoad}
                            onClick={() => handleValidateOrder()}
                        >
                            Proceed to Checkout
                        </Button>
                    </VStack>
                </Box>
            </Flex>
        </Box>
    )
}


export default function CheckoutPage() {

    const { data: cartData = {}, isLoading: cartLoad } = useGetUserCarts({})
    const { data: carts = {} } = cartData

    const { data: addressBookData = {}, isLoading: addressLoad } = useGetUserAddresses({})
    const { data: addressBooks = [] } = addressBookData

    return (
        <PageMainContainer title='Checkout' description='Checkout'>
            <MainAppLayout noFooter>
                <AnimateRoute>
                    <Container>
                        <CheckoutMain 
                            carts={carts?.cart ?? []} 
                            cartLoad={cartLoad} 
                            addressBooks={addressBooks ?? []}
                            addressLoad={addressLoad}
                        />
                    </Container>
                </AnimateRoute>
            </MainAppLayout>
        </PageMainContainer>
  )
}
