import AnimateRoute from "../../common/AnimateRoute"
import PageMainContainer from "../../common/PageMain"
import MainAppLayout from "../../layouts/MainAppLayout"
import {
    Box,
    Heading,
    Text,
    Image,
    Flex,
    Stack,
} from '@chakra-ui/react';
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";

// import contactImg from "../../assets/images/contact.png"
import vEditionImg from "../../assets/images/vEditionContact.png"
import { Container } from "../../styling/layout";

function ContactMain () {


    return (
        <Box mx="auto" py={[10, 20]} px={[4, 8]}>
        {/* HEADER */}
        <Box textAlign="center" mb={[12, 20]}>
          <Heading textAlign="center" fontSize={["24px", '30px']} fontWeight={400}>
            CONTACT US
          </Heading>
          <Text color="gray.500" mt={2}>We’re here to help. Get in touch with us.</Text>
        </Box>
  
        {/* HERO SECTION */}
        <Flex direction={["column", "row"]} gap={[8, 12]} mb={[14, 20]}>
          {/* Image */}
          <Box flex={1}>
            <Image 
              src={vEditionImg}
              alt="V-Edition Building"
              w="100%" 
            //   h={["100%", '600px']} 
              objectFit="cover" 
              borderRadius="xl"
            />
          </Box>
  
          {/* Contact Info */}
          <Stack spacing={6} flex={1} justify="center">
            <Stack >
              <Heading fontSize="2xl" letterSpacing="wider" mb={2}>
              GET IN TOUCH
            </Heading>
            <Flex align="center" gap={3}>
              <MdEmail size={30}/>
              <Box>
                <Text fontWeight={500} fontSize="md">veditionlinegroup@gmail.com</Text>
                <Text fontWeight={500} fontSize="md">vincentamaechi@gmail.com</Text>
              </Box>
            </Flex>
            <Flex align="center" gap={3}>
              <MdPhone size={24}/>
              <Text fontWeight={500} fontSize="lg">0619504722</Text>
            </Flex>
            <Flex align="center" gap={3}>
              <MdLocationOn size={24}/>
              <Text fontWeight={500} fontSize="lg">
                Fellonoord 39, 5612 AA Eindhoven.
              </Text>
            </Flex>
            </Stack>

              <Box mt={4}>
            {/* <Heading fontSize="2xl" fontWeight={700} letterSpacing="wide" mb={6}>
              ABOUT V-EDITION
            </Heading> */}
            <Text color="gray.600" lineHeight="tall">
              V-Edition is an innovative brand specializing in contemporary fashion and accessories.
              We pride ourselves on the construction of high-quality, stylish designs that elevate everyday wear.
              <br />
              Our goal is simple: timeless fashion, curated experiences, and exceptional customer satisfaction — always.
              Reach out for more information or assistance.
            </Text>
          </Box>
          </Stack>
        </Flex>
  
        {/* <Flex direction={["column", "row-reverse"]} gap={[8, 12]} align="center">
          <Box flex={1}>
            <Image 
              src={contactImg}
              alt="Customer Support"
              w="100%" 
              h="100%" 
              objectFit="cover" 
              borderRadius="xl"
            />
          </Box>
  
          <Box flex={1}>
            <Heading fontSize="2xl" fontWeight={700} letterSpacing="wide" mb={6}>
              ABOUT V-EDITION
            </Heading>
            <Text color="gray.600" lineHeight="tall">
              V-Edition is an innovative brand specializing in contemporary fashion and accessories.
              We pride ourselves on the construction of high-quality, stylish designs that elevate everyday wear.
              <br /><br />
              Our goal is simple: timeless fashion, curated experiences, and exceptional customer satisfaction — always.
              Reach out for more information or assistance.
            </Text>
          </Box>
        </Flex> */}
      </Box>
    )
}

export default function ContactPage() {
    return (
        <PageMainContainer title='Contact Us' description='Contact Us'>
            <MainAppLayout>
                <Container>
                <AnimateRoute>
                    <ContactMain />
                </AnimateRoute>
                </Container>
            </MainAppLayout>
        </PageMainContainer>
    )
}
