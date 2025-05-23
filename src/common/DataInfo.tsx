import { Box, Card, CardBody, CardHeader, Heading, HStack, Skeleton, Text, VStack } from "@chakra-ui/react";
import { ReactNode } from "react";
import { IconType } from "react-icons";

export function CardSection({
    title = "",
    children,
    showHeader = true,
    headColor,
    containerProps = {},
    headerTextProps = {
        fontSize: '22px',
        fontWeight: 600
    },
    bodyProps = {}
}: any) {
    return (
        <Card maxW='full' mb={6} {...containerProps}>
            {showHeader ?
           <CardHeader>
                <Heading text={title} color={headColor ?? "black"} {...headerTextProps}/>

           </CardHeader> : null }
           <CardBody {...bodyProps}>
                {children}
           </CardBody>
        </Card>
    )
}

export default function DataInfo({
    Icon,
    title,
    value,
    iconColor,
    isLoading
}:{Icon: string | IconType, value: string | Number | ReactNode | any, title: string, iconColor?:string, isLoading: boolean}){
    return(

        <CardSection showHeader={false} containerProps={{ border: `1.5px solid gray.900`, width: ['200px', '280px', '380px'] }}>
            <VStack align='flex-start' w='100%'>
                <HStack spacing={4}>
                    <Box border={`1px solid #ee`} py={2} px={2} borderRadius='8px'>
                        <Icon color={iconColor ?? "green"} size={20}/>
                    </Box>
                </HStack>
                
                <Text fontWeight={600} color={'gray'} fontSize='14px'>{title}</Text>
                {isLoading ? (        
                    <Box w='full' borderRadius='md'>
                        <Skeleton borderRadius='md' h='10px' mb={2} />
                        <Skeleton borderRadius='md' h='10px' mb={2}/>
                    </Box>
                    ) :
                    <VStack>
                        <Text fontWeight={800} fontSize='26px'>{value}</Text>
                    </VStack>
                }
            </VStack>
        </CardSection>
    )
}