import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router";
import React from "react";

export default function FullScreenLayout() {

    return (
        <React.Fragment>
            <Box as="main" w={'100%'}>
                <Outlet />
            </Box>
        </React.Fragment>
    )
}
