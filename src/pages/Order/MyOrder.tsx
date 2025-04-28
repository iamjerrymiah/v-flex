import { Box, Button, Heading } from "@chakra-ui/react";
import AnimateRoute from "../../common/AnimateRoute";
import PageMainContainer from "../../common/PageMain";
import MainAppLayout from "../../layouts/MainAppLayout";
import { Container } from "../../styling/layout";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { useNavigate } from "react-router";
import { useGetUserOrders } from "../../hooks/orders/orders";
import { Table, TableRow } from "../../common/Table/Table";
import { capCase } from "../../utils/utils";
import { useEffect } from "react";
import { useGetAuthState } from "../../hooks/auth/AuthenticationHook";

const tableHeads = ["S/N", "Name"]

function MyOrdersMain ({ myOrders = [], isLoading = false}:any) {

    const navigate = useNavigate()
    const { isAuthenticated } =  useGetAuthState();

    useEffect(() => { 
        if(!isAuthenticated) {
            navigate(-1)
        } 
    }, [isAuthenticated])

    return (

        <Box pt={10}>
        
            <Heading textAlign="center" fontSize={["24px", '30px']} fontWeight={400} my={10}> MY ORDER </Heading>

            <Button
                leftIcon={<MdOutlineArrowBackIos />}
                variant="ghost"
                onClick={() => navigate(-1)}
                mt={4}
                mb={4}
                textDecor={'underline'}
            >
                Back
            </Button>

            <Table
                headings={tableHeads}
                loading={isLoading}
                isEmpty={myOrders?.length <= 0}
                emptyText='No order found'
                pt={3}
                noIndexPad
            >
                {myOrders?.map((item:any, index:any) =>
                    <TableRow
                        key={index}
                        data={[
                            (index + 1 ),
                            capCase(item?.name ?? "-")
                        ]}
                        noIndexPad
                    />
                )}
            </Table>

        </Box>
    )
}

export default function MyOrderPage() {

    const { data: orderData = {}, isLoading } = useGetUserOrders({})
    const { data: myOrders = [] } = orderData

    return (
        <PageMainContainer title='My Orders' description='My Orders'>
            <MainAppLayout>
                <Container>
                    <AnimateRoute>
                        <MyOrdersMain 
                            isLoading={isLoading}
                            myOrders={myOrders}
                        />
                    </AnimateRoute>
                </Container>
            </MainAppLayout>
        </PageMainContainer>
    )
}
