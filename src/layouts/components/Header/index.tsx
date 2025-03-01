import styled from 'styled-components';
import DesktopHeader from './desktop';
import MobileHeader from './mobile';

export const HeaderWrapper = styled.header`
    position: relative;
    z-index: 1002;
`;

export default function Header() {
    return (
        <HeaderWrapper>
            <DesktopHeader />
            <MobileHeader />
        </HeaderWrapper>
    )
}
