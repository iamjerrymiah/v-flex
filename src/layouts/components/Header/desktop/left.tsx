import { Image } from "@chakra-ui/react";
import { Link } from "react-router";
import styled, { css } from "styled-components";

// import vEditionLogo from '../../../../assets/icons/v-edition-logo.png'
import vEditionLogo from '../../../../assets/icons/vev-logo.png'

export const spaceBetweenAndCenter = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const LeftStyle = styled.div`
    ${spaceBetweenAndCenter};
    width: 40%;
`;


export default function HeaderLeft() {
    return (
        <LeftStyle>
            <Link to={'/'}>
                {/* <Text fontSize={'30px'} fontWeight={400}>V-EDITION</Text> */}
                <Image
                    src={vEditionLogo}
                    width={'120px'}
                    height={'45px'}
                    alt='logo'
                    objectFit={'contain'}
                />
            </Link>
        </LeftStyle>
    )
}
