import AnimateRoute from "../../common/AnimateRoute"
import PageMainContainer from "../../common/PageMain"
import MainAppLayout from "../../layouts/MainAppLayout"
import { Box, Center } from '@chakra-ui/react'
// import { MotionAnimator } from "../../common/MotionAnimator"
import EmptyListHero from "../../common/EmptyListHero"
import Loader from "../../common/Loader"
import { useGetProducts } from "../../hooks/products/products";

import { useSearchParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container } from "../../styling/layout"
import { ProductPageSk } from "../../common/PageSk"
import { useQueryParams } from "../../providers/useQueryParams"
import ProductGrid from "./components/ProductGrid"

import { useGetProductCollections } from "../../hooks/products/collections"
import ProductLayout from "./components/ProductLayout"


function ProductsMain() {

    const location = useLocation();
    const { queryParams } = useQueryParams()
    // const { category } = useParams<{ category: string }>();

    const [searchParams] = useSearchParams();
    const categoryId = searchParams.get("componentsVfcategory");

    const [filter, setFilter] = useState({
        sortBy: 'recent',
        categoryId: categoryId ?? ""
    })

    const { data: productData = {}, isLoading } = useGetProducts({...filter, ...queryParams})
    const { data: products = {} } = productData

    const { data: collectionData = {} } = useGetProductCollections({})
    const { data: categories = [] } = collectionData

    useEffect(() => {
        setFilter((prev) => ({
          ...prev,
          categoryId: searchParams.get("componentsVfcategory") || "",
        }));
    }, [location.search]);

    return (
        <>
            {/* <Flex
                h="50vh"
                w="full"
                justify="center"
                align="center"
                direction="column"
                textAlign="center"
                bgImage={heroImg}
                bgSize={['auto', 'cover']}
                objectFit={'contain'}
                bgRepeat="no-repeat"
                bgPosition="top"
                backgroundAttachment="fixed"
            >
                <MotionAnimator direction='left' delay={0.4}>
                    <Heading 
                        color={'white'} 
                        fontSize={["3xl", "3xl", '5xl']} 
                        fontWeight="bold"
                        px={4}
                    >
                        Exclusive Fashion for {capCase(category ?? "Everyone")}
                    </Heading>
                </MotionAnimator>
            </Flex> */}

            <Container>
                <Box px={['20px', '20px', '30px', '50px']}>
                    {isLoading ? (
                        <>
                            <Loader />
                            <ProductPageSk />
                        </>
                    ) : products?.products?.length <= 0 ? (
                        <Center mt={10}>
                            <EmptyListHero
                                w="400px"
                                text="Sorry, can't find the product you're looking for" 
                            />
                        </Center>
                    ) : (
                        <Box mt={[14]}>
                            
                            <ProductLayout categories={categories ?? []}>
                                <ProductGrid 
                                    products={products?.products}
                                    init={products}
                                    filters={filter}
                                    setFilters={setFilter}
                                />
                            </ProductLayout>

                        </Box>
                    )}
                </Box>
            </Container>
        </>
    )
}


export default function AllProducts () {


    return(
        <PageMainContainer title='Products' description='Products'>
            <MainAppLayout px='0px'>
                <AnimateRoute>
                    <ProductsMain  />
                </AnimateRoute>
            </MainAppLayout>
        </PageMainContainer>
    )
}

