import { Box, Heading, Text, VStack } from "@chakra-ui/react";

export default function VisionSection() {
    return (
        <Box 
          bgGradient="linear(to-r, gray.50, gray.200)" 
          py={{ base: 16, md: 24 }} 
          px={4}
        >
            <VStack spacing={6} textAlign="center">
              <Heading 
                fontSize={['4xl', '4xl', '4xl', "5xl"]}
                // fontWeight="bold" 
                // textTransform="uppercase"
              >
                Our Vision
              </Heading>
              <Text 
                fontSize={'18px'} 
                color="gray.600" 
                fontWeight="medium"
                maxW="2xl"
              >
                At <strong>V-Edition Line</strong>, we blend <strong>style</strong>, 
                <strong> comfort</strong>, and <strong>versatility</strong> to create 
                fashion that moves with you. Our designs reflect a modern, dynamic 
                lifestyle—where <strong>quality</strong> meets <strong>individuality</strong>.  
                Whether casual or statement pieces, V-Edition is all about 
                <strong> confidence</strong> and <strong>expression</strong>.  
                Elevate your wardrobe with our signature looks.
              </Text>
            </VStack>
        </Box>
    );
};
    