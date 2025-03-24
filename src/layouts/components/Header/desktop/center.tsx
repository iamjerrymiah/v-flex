import React from "react";
import styled from "styled-components";
import { spaceBetweenAndCenter } from "./left";
import { Link as RouterLink } from "react-router";

const Container = styled.div`
    ${spaceBetweenAndCenter};
    width: 20%;
    font-size: 14px;
    font-weight: 400;
    padding-top: 6px;
    color: #000;
`;

const Link = styled(RouterLink)`
    padding: 10px;
    font-weight: 500;
    font-size: 14px;
    transition: .2s ease-in-out;
    min-width: max-content;
    &:hover {
        color: gray;
    }
`


export const headerLinks = [
    {
        title: "HOME",
        url: "/",
    },
    {
        title: "FIND PRODUCT",
        url: "/products/vl",
    },
    // {
    //     title: "ABOUT US",
    //     url: "/about-us",
    // },
    {
        title: "CONTACT US",
        url: "/contact-us",
    },
]

export default function HeaderCenter() {
    return (
        <React.Fragment>
            <Container >
                {headerLinks.map((link, index) =>
                    <Link
                        to={link.url}
                        key={index}
                    >
                        {link.title}
                    </Link>
                )}
            </Container>
        </React.Fragment>
    )
}
