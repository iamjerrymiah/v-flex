import { Link } from "react-router";
import { LeftStyle } from "../desktop/left";
import { Image } from "@chakra-ui/react";
import vEditionLogo from '../../../../assets/icons/v-edition-logo.png'

export default function HeaderLeft() {
    return (
        <LeftStyle>
            <Link to={'/'}>
                {/* <Text fontSize={'26px'} fontWeight={500}>V-EDITION</Text> */}
                <Image
                    src={vEditionLogo}
                    width={'80px'}
                    height={'50px'}
                    alt='logo'
                    objectFit={'contain'}
                />
            </Link>
        </LeftStyle>
    )
}
