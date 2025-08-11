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
import { useSearchParams } from "react-router";


function ProductsMain() {

    // const location = useLocation();
    // const { queryParams } = useQueryParams()
    // const { category } = useParams<{ category: string }>();

    const [searchParams] = useSearchParams();
    const discount = searchParams.get("deals");
    
    const { topCategory, subCategory, linkCategory } = useCategoryContext();

    const [search, setSearch] = useState<any>({})
    const [filter, setFilter] = useState({
        sortBy: 'recent',
        discount: discount ? true : null
        // categoryId: categoryId ?? ""
    })
    const [isOpen, setIsOpen] = useState(true);

    const { data: productData = {}, isLoading } = useGetProducts({...filter})
    const { data: products = {} } = productData

    const { data: collectionData = {} } = useGetProductCollections({})
    const { data: categories = [] } = collectionData

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
            <Container>
                <Box px={['20px', '20px', '30px', '50px']}>
                    <Box mt={[14]}>
                        <ProductLayout
                            isOpen={isOpen}
                            setIsOpen={setIsOpen} 
                            categories={categories ?? []}
                            filter={filter}
                            setFilter={setFilter}
                            search={search}
                            setSearch={setSearch}
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

