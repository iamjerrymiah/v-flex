import styled from "styled-components";
import { MobileAndTablet } from "../../../../styling/breakpoints";
import HeaderLeft from "./left";
import HeaderRight from "../right";

const HeaderStyle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 20px;
  background-color: white;
  position: fixed;
  top: 0px;
  width: 100%;
  height: 85px;
  box-shadow: '0px -5px 10px gray';
`;

export default function MobileHeader() {
    return (
        <MobileAndTablet>
            <HeaderStyle>
                <HeaderLeft />
                <HeaderRight mobile/>
            </HeaderStyle>
        </MobileAndTablet>
    )
}
