import { Button, Flex, Heading, Text } from '@chakra-ui/react'

import heroImg from '../../../assets/images/hero.webp'
import { useNavigate } from 'react-router'
import { MotionAnimator } from '../../../common/MotionAnimator'

export default function HeroSection() {

    const navigate = useNavigate()

    return (
        <Flex
            h="100vh"
            w="full"
            justify="center"
            align="center"
            direction="column"
            textAlign="center"
            bgImage={heroImg}
            bgSize="cover"
            objectFit={'cover'}
            bgRepeat="no-repeat"
            bgPosition="center"
            backgroundAttachment="fixed"
        >
            <MotionAnimator direction='left' delay={0.4}>
                <Heading 
                    color={'white'} 
                    fontSize={["5xl", "5xl", '6xl']} 
                    fontWeight="bold"
                >
                    Exclusive Fashion for Everyone
                </Heading>
            </MotionAnimator>
            <Text fontSize={["14px", '16px', '16px', '20px']} fontWeight={600} mt={4}>Discover the latest trends in male and female fashion</Text>
            <Button 
                mt={6} 
                size="lg" 
                colorScheme="blackAlpha"
                onClick={() => navigate("/products")}
            >
                Shop Now
            </Button>
        </Flex>
    )
}
