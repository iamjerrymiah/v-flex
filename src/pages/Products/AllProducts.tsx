import AnimateRoute from "../../common/AnimateRoute"
import PageMainContainer from "../../common/PageMain"
import MainAppLayout from "../../layouts/MainAppLayout"
import { Box } from '@chakra-ui/react'
import { useGetProducts } from "../../hooks/products/products";

import { useEffect, useState } from "react";
import { Container } from "../../styling/layout"
import ProductGrid from "./components/ProductGrid"

import { useGetProductCollections } from "../../hooks/products/collections"
import ProductLayout from "./components/ProductLayout"
import { useCategoryContext } from "../../providers/CategoryContext"


function ProductsMain() {

    // const location = useLocation();
    // const { queryParams } = useQueryParams()
    // const { category } = useParams<{ category: string }>();

    // const [searchParams] = useSearchParams();
    // const categoryId = searchParams.get("componentsVfcategory");
    const { topCategory, subCategory, linkCategory } = useCategoryContext();

    const [filter, setFilter] = useState({
        sortBy: 'recent',
        // categoryId: categoryId ?? ""
    })
    const [isOpen, setIsOpen] = useState(true);

    const { data: productData = {}, isLoading } = useGetProducts({...filter})
    const { data: products = {} } = productData

    const { data: collectionData = {} } = useGetProductCollections({})
    const { data: categories = [] } = collectionData

    // useEffect(() => {
    //     setFilter((prev) => ({
    //         ...prev,
    //         categoryId: linkCategory?._id || subCategory?._id || "",
    //         nameJ: linkCategory?.name || subCategory?.name || "",
    //     //   categoryId: searchParams.get("componentsVfcategory") || "",
    //     }));
    // }, [linkCategory, subCategory ]);

    useEffect(() => {
        if (linkCategory?._id) { setFilter(prev => ({ ...prev, categoryId: linkCategory._id })) }
    }, [linkCategory]);

    useEffect(() => {
        if (subCategory?._id) { setFilter(prev => ({ ...prev, categoryId: subCategory._id })) }
    }, [subCategory]);

    useEffect(() => {
        if (topCategory?._id) { setFilter(prev => ({ ...prev, categoryId: topCategory._id })) }
    }, [topCategory]);

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
                    <Box mt={[14]}>
                        <ProductLayout
                            isOpen={isOpen}
                            setIsOpen={setIsOpen} 
                            categories={categories ?? []}
                            filter={filter}
                            setFilter={setFilter}
                        >
                            <ProductGrid 
                                products={products?.products}
                                init={products}
                                filters={filter}
                                setFilters={setFilter}
                                isOpen={isOpen}
                                setIsOpen={setIsOpen}
                                isLoading={isLoading}
                            />
                        </ProductLayout>

                    </Box>
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

