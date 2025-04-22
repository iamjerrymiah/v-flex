import { Box, Button, Heading } from "@chakra-ui/react";
import AnimateRoute from "../../common/AnimateRoute";
import PageMainContainer from "../../common/PageMain";
import MainAppLayout from "../../layouts/MainAppLayout";
import { Container } from "../../styling/layout";
import { useNavigate } from "react-router";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { Table, TableRow } from "../../common/Table/Table";
import { useGetAllUsers } from "../../hooks/user/users";
import { allCaps, allLower, capCase } from "../../utils/utils";
// import { useGetAuthState } from "../../hooks/auth/AuthenticationHook";
// import { useEffect } from "react";

const tableHeads = ["S/N", "Salutation", "First Name", "Last Name", "Email", "Phone Number", "Is Email Verified?", "Status"]

function AdminUserMain ({ users = [], isLoading = false }: any) {

    const navigate = useNavigate()
    // const { isAuthenticated } =  useGetAuthState();

    // useEffect(() => { 
    //     if(!isAuthenticated) {
    //         navigate(-1)
    //     } 
    // }, [isAuthenticated])

    return (
        <Box pt={10}>

            <Heading textAlign="center" fontSize={["24px", '30px']} fontWeight={400} my={10}> USERS </Heading>

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
                isEmpty={users?.length <= 0}
                emptyText='No user found'
                pt={3}
                noIndexPad
            >
                {users?.map((item:any, index:any) =>
                    <TableRow
                        key={index}
                        // onClickRow={}
                        data={[
                            (index + 1 ),
                            allCaps(item?.salutation ?? "-"),
                            capCase(item?.firstName ?? "-"),
                            capCase(item?.lastName ?? "-"),
                            allLower(item?.email ?? "-"),
                            item?.phoneNumber ?? "-",
                            capCase(item?.emailVerified === true ? "Yes" : "No"),
                            allLower(item?.status)
                        ]}
                        options={[]}
                        noIndexPad
                    />
                )}
            </Table>
        </Box>
    )
}

export default function AdminUserPage() {

    const { data: userData = {}, isLoading } = useGetAllUsers({})
    const { data: users = [] } = userData

    return (
        <PageMainContainer title='Users' description='Users'>
            <MainAppLayout>
                <Container>
                    <AnimateRoute>
                        <AdminUserMain 
                            isLoading={isLoading}
                            users={users}
                        />
                    </AnimateRoute>
                </Container>
            </MainAppLayout>
        </PageMainContainer>
    )
}
