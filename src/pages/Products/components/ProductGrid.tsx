import { Box, Grid } from "@chakra-ui/react";
import Pagination from "../../../common/Pagination/Pagination";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products, init, filters, setFilters }: {products: any[], init:any, filters:any, setFilters:any }) => {

    const changePage = ({ selected = 0 }) => {
        setFilters({ ...filters, page: selected + 1 });
    }

    return (
        <>
            <Box cursor={'pointer'} mb={12}>
                <Grid 
                    templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
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

            <Pagination
                pageCount={init?.totalPages}
                onPageChange={changePage}
            />
        </>
    );
};

export default ProductGrid