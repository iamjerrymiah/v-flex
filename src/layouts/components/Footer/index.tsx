import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { MotionAnimator } from "../../../common/MotionAnimator";
import { Link } from "react-router";
import { Box, HStack, Image, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { Container } from "../../../styling/layout";
import vEditionLogo from "../../../assets/icons/v-edition-logo.png"

export default function Footer ({}) {
    return (
        <Container>
            <Box 
                as="footer"
                py={10}
                mt={'100px'}
                px={['20px', '20px', '30px', '50px']}
            >
                <MotionAnimator delay={0.2}>
                    <SimpleGrid maxW={'100%'} columns={[1,1,1,4]} spacing={8} >
                        <div>
                            <Link to={'/'}>
                                {/* <Text fontSize={['24px', '24px', '24px', '36px']} fontWeight={700}>V-EDITION</Text> */}
                                <Image
                                    src={vEditionLogo}
                                    width={'250px'}
                                    height={'80px'}
                                    alt='logo'
                                    objectFit={'contain'}
                                    my={4}
                                />
                            </Link>
                            <Text fontSize={'12px'}>Copyright © 2025 V-EDITION. All Rights Reserved.</Text>
                        </div>

                        <div>
                            <Text fontSize={'18px'} fontWeight={700} mb={3} >OUR WORLD</Text>
                            <Stack color={'#000'} fontSize={'14px'} spacing={2}>
                                <li><Link to="#" className="hover:text-white">Men's Collection</Link></li>
                                <li><Link to="#" className="hover:text-white">Women's Collection</Link></li>
                                <li><Link to="#" className="hover:text-white">Store Collection</Link></li>
                                {/* <li><Link to="#" className="hover:text-white">Explore</Link></li> */}
                                {/* <li><Link to="#" className="hover:text-white">Terms & Services</Link></li> */}
                            </Stack>
                        </div>

                        <div>
                            <Text fontSize={'18px'} fontWeight={700} mb={3} >CUSTOMER CARE</Text>
                            <Stack color={'#000'} fontSize={'14px'} spacing={2}>
                                <li><Link to="#" className="hover:text-white">Payments</Link></li>
                                <li><Link to="#" className="hover:text-white">Delivery and Return</Link></li>
                                <li><Link to="#" className="hover:text-white">Pick up in Store</Link></li>
                                <li><Link to="#" className="hover:text-white">Size Guide</Link></li>
                                <li><Link to="#" className="hover:text-white">Faq</Link></li>
                                <li><Link to="/contact-us" className="hover:text-white">Contact Us</Link></li>
                            </Stack>
                        </div>

                        <div>
                            <Text fontSize={'18px'} fontWeight={700} mb={3} >CORPORATE INFO</Text>
                            <Stack color={'#000'} fontSize={'14px'} spacing={2}>
                                <li><Link to="#" className="hover:text-white">Imprint</Link></li>
                                <li><Link to="#" className="hover:text-white">Privacy Policy</Link></li>
                                <li><Link to="#" className="hover:text-white">Terms and Conditions</Link></li>
                            </Stack>
                            <HStack mt={['30px', '30px', '30px', '70px' ]} spacing={4}>
                                <Link to="#"><FaInstagram color="#000" size={18} /></Link>
                                <Link to="#"><FaFacebook color="#000" size={18} /></Link>
                                <Link to="#"><FaTwitter color="#000" size={18} /></Link>
                                <Link to="#"><FaLinkedin color="#000" size={18} /></Link>
                            </HStack>
                        </div>
                    </SimpleGrid>
                </MotionAnimator>

            </Box>
        </Container>
    );
};
