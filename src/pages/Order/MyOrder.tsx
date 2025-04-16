import { Box, Center, Heading } from "@chakra-ui/react";
import AnimateRoute from "../../common/AnimateRoute";
import PageMainContainer from "../../common/PageMain";
import MainAppLayout from "../../layouts/MainAppLayout";
import { Container } from "../../styling/layout";
import { useState } from "react";
import Loader from "../../common/Loader";
import PageSk from "../../common/PageSk";
import EmptyListHero from "../../common/EmptyListHero";

function MyOrdersMain () {

    const isLoading = false
    const [myOrders] = useState([])

    return (

        <Box pt={10}>
        
            <Heading textAlign="center" fontSize={["24px", '30px']} fontWeight={400} my={10}> MY ORDER </Heading>
                {isLoading ? (
                    <>
                        <Loader />
                        <PageSk />
                    </>
                ) : myOrders?.length <= 0 ? (
                    <Center mt={10}>
                        <EmptyListHero
                            w="400px"
                            text="No Order Found" 
                        />
                    </Center>
                ) : 
                    <></>
                }

        </Box>
    )
}

export default function MyOrderPage() {

    return (
        <PageMainContainer title='My Orders' description='My Orders'>
            <MainAppLayout>
                <Container>
                    <AnimateRoute>
                        <MyOrdersMain />
                    </AnimateRoute>
                </Container>
            </MainAppLayout>
        </PageMainContainer>
    )
}
