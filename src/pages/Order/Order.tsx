import { Box, Button, Heading } from "@chakra-ui/react"
import AnimateRoute from "../../common/AnimateRoute"
import PageMainContainer from "../../common/PageMain"
import MainAppLayout from "../../layouts/MainAppLayout"
import { Container } from "../../styling/layout"
import { MdOutlineArrowBackIos } from "react-icons/md"
import { useNavigate } from "react-router"
import { useGetAllOrders } from "../../hooks/orders/orders"
import { Table, TableRow } from "../../common/Table/Table"
import { capCase } from "../../utils/utils"
import { useGetAuthState } from "../../hooks/auth/AuthenticationHook"
import { useEffect } from "react"

const tableHeads = ["S/N", "Name"]

function OrdersMain ({ orders = [], isLoading = false }: any) {
    
    const navigate = useNavigate()
    const { isAuthenticated } =  useGetAuthState();

    useEffect(() => { 
        if(!isAuthenticated) {
            navigate(-1)
        } 
    }, [isAuthenticated])

    return (
        <Box pt={10}>

        
            <Heading textAlign="center" fontSize={["24px", '30px']} fontWeight={400} my={10}> ORDER LIST </Heading>

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
                isEmpty={orders?.length <= 0}
                emptyText='No order found'
                pt={3}
                noIndexPad
            >
                {orders?.map((item:any, index:any) =>
                    <TableRow
                        key={index}
                        // onClickRow={}
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

export default function OrderPage() {

    const { data: orderData = {}, isLoading } = useGetAllOrders({})
    const { data: orders = [] } = orderData

    return (
        <PageMainContainer title='Orders' description='Orders'>
            <MainAppLayout>
                <Container>
                    <AnimateRoute>
                        <OrdersMain 
                            isLoading={isLoading}
                            orders={orders}
                        />
                    </AnimateRoute>
                </Container>
            </MainAppLayout>
        </PageMainContainer>
    )
}
