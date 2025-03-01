import React, { useEffect } from 'react';
import Helmet from 'react-helmet';
import { Box } from '@chakra-ui/react';


function Main({ children, fullPage }:any) {
    return (
        <Box
            as='main'
            minH={fullPage ? '77vh' : ''}
            w={['full', 'full', '']}
            pt={fullPage ? 5 : ''}
            pb={fullPage ? '80px' : ''}
        >
            {children}
        </Box>
    )
}

const PageMainContainer = React.memo(({ title, description, children, fullPage, }:any) => {

    useEffect(() => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }, [])

    return (
        <React.Fragment>
            <Helmet>
                {title && <title> {`${title} ${title ? '| V-Flex' : 'V-Flex'}`} </title>}
                {description && <meta name="description" content={description} />}
            </Helmet>
            <Main fullPage={fullPage}>
                {children}
            </Main>
        </React.Fragment>
    )
})

export default PageMainContainer;