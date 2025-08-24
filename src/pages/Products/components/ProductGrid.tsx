import { Box, Center, Grid } from "@chakra-ui/react";
import Pagination from "../../../common/Pagination/Pagination";
import ProductCard from "./ProductCard";
import { ProductPageSk } from "../../../common/PageSk";
import EmptyListHero from "../../../common/EmptyListHero";

const ProductGrid = ({ 
    products, 
    init, 
    filters, 
    setFilters,
    isOpen,
    isLoading
}: {products: any[], init:any, filters:any, setFilters:any, isLoading:boolean, isOpen:boolean, setIsOpen?:any }) => {

    const changePage = ({ selected = 0 }) => {
        setFilters({ ...filters, page: selected + 1 });
    }

    return (
        <>
            {isLoading ? ( <ProductPageSk />) :
            products?.length <= 0 || !products?.length ? 
            (
                <Center mt={10}>
                    <EmptyListHero
                        w="400px"
                        text="Sorry, can't find the product you're looking for" 
                    />
                </Center>
            ) :
            (
                <Box cursor={'pointer'} mb={12}>
                    <Grid 
                        templateColumns={{ base: "1fr", sm: `repeat(${isOpen?'1':'2'}, 1fr)`, md: `repeat(${isOpen?'1':'2'}, 1fr)`, lg: `repeat(3, 1fr)` }}
                        gap={[14, 20]}
                    >
                    {products?.map((product:any) => (
                        <ProductCard 
                            key={product._id} 
                            product={product} 
                        />
                    ))}

                    </Grid>
                </Box>
            )}

            <Pagination
                onPageChange={changePage}
                currentPage={init?.currentPage}
                pageCount={init?.totalPages}
            />
        </>
    );
};

export default ProductGrid