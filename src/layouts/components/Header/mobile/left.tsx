import { Link } from "react-router";
import { LeftStyle } from "../desktop/left";
import { Text } from "@chakra-ui/react";

export default function HeaderLeft() {
    return (
        <LeftStyle>
            <Link to={'/'}>
                <Text fontSize={'26px'} fontWeight={500}>V-FLEX</Text>
            </Link>
        </LeftStyle>
    )
}
