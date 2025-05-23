import { Box } from "@chakra-ui/react"
import Header from "./components/Header"
import Footer from "./components/Footer"
import React from "react"
import { useGetAuthState, useGetAuthUser } from "../hooks/auth/AuthenticationHook"
import { useGetProductCollections } from "../hooks/products/collections"


const ChildrenWrapper = ({ children, px, mt }: { children: React.ReactNode, px?:any, mt?:any }) => (
    <Box 
        mt={mt ?? ['80px', '70px', '70px', '70px']} 
        px={px ?? ['20px', '20px', '30px', '50px']}
    >
        {children}
    </Box>
)

export default function MainAppLayout(props:any) {

    const { isAuthenticated, user } =  useGetAuthState();

    const { } = useGetAuthUser(!isAuthenticated && !user);

    const { } = useGetProductCollections({})

    return (
        <React.Fragment>
            <Header />
            <ChildrenWrapper px={props?.px} mt={props?.mt}>
                {props.children}
            </ChildrenWrapper>
            {!props?.noFooter && <Footer />}
        </React.Fragment>
    )
}
