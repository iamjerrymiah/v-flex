import styled from 'styled-components';
import DesktopHeader from './desktop';
import MobileHeader from './mobile';
import HeaderLeft from './mobile/left';
import { Box } from '@chakra-ui/react';

export const HeaderWrapper = styled.header`
    position: relative;
    z-index: 1002;
`;

export default function Header({justLogo}:any) {
    return (
        <HeaderWrapper>
            {
                justLogo ? <Box px={4} py={2}><HeaderLeft /></Box> :
                <>
                    <DesktopHeader />
                    <MobileHeader />
                </>
            }
        </HeaderWrapper>
    )
}
