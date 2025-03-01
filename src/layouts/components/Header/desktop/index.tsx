import { Box, HStack } from "@chakra-ui/react"
import { DesktopOnly } from '../../../../styling/breakpoints'
import { Container } from "../../../../styling/layout"
import React from "react"
import HeaderLeft from "./left"
import HeaderRight from "../right"
import HeaderCenter from "./center"

const HeaderStyle = ({children}: {children: React.ReactNode}) => (
    <HStack 
        h='full' 
        w='full' 
        alignItems='center' 
        justify={'space-between'}
        py='10px' 
        px={['0px', '20px', '20px', '30px']}
    >
        {children}
    </HStack>
)
const Wrapper = ({ children }: {children: React.ReactNode}) => (
    <Box
        bgColor={'white'}
        pos='fixed'
        top='0px'
        w='100%'
        // boxShadow={`0px -5px 10px gray`}
    >
        {children}
    </Box>
)

export default function DesktopHeader() {
    return (
        <DesktopOnly>
            <Wrapper>
                <Container>
                    <HeaderStyle>
                        <HeaderLeft />
                        <HeaderCenter />
                        <HeaderRight />
                    </HeaderStyle>
                </Container>
            </Wrapper>
        </DesktopOnly>
    )
}
