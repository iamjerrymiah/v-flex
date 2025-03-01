import { Box } from "@chakra-ui/react"
import Header from "./components/Header"
import Footer from "./components/Footer"
import React from "react"
import { useGetAuthState, useGetAuthUser } from "../hooks/auth/AuthenticationHook"


const ChildrenWrapper = ({ children, px }: { children: React.ReactNode, px?:any }) => (
    <Box 
        mt={['85px', '85px', '85px', '90px']} 
        px={px ?? ['20px', '20px', '30px', '50px']}
    >
        {children}
    </Box>
)

export default function MainAppLayout(props:any) {

    const { isAuthenticated, user } =  useGetAuthState();

    const { } = useGetAuthUser(!isAuthenticated && !user);

    return (
        <React.Fragment>
            <Header />
            <ChildrenWrapper px={props?.px}>
                {props.children}
            </ChildrenWrapper>
            {!props?.noFooter &&
                <Footer />
            }
        </React.Fragment>
    )
}
