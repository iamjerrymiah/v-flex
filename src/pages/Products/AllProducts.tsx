import AnimateRoute from "../../common/AnimateRoute"
import PageMainContainer from "../../common/PageMain"
import MainAppLayout from "../../layouts/MainAppLayout"
import { Image, Stack, Text, Box, Grid, GridItem, Icon, Button, Flex, Heading, Center  } from '@chakra-ui/react'
import { FaCheckToSlot } from "react-icons/fa6"
import { FcCancel } from 'react-icons/fc'
import { capCase, moneyFormat } from "../../utils/utils"
import { MotionAnimator } from "../../common/MotionAnimator"
import EmptyListHero from "../../common/EmptyListHero"
import Loader from "../../common/Loader"
import { useGetProducts } from "../../hooks/products/products";

import heroImg from '../../assets/images/hero.webp'
import noProductImage from '../../assets/icons/noproduct.png'
import { useNavigate } from "react-router";
import { useParams, useSearchParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container } from "../../styling/layout"
import { ProductPageSk } from "../../common/PageSk"
import Pagination from "../../common/Pagination/Pagination"
import { useQueryParams } from "../../providers/useQueryParams"


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
  
const ProductCard = ({ product }:any) => {
    
    const navigate = useNavigate()

    const { category, subCategory } = useParams<{ category: string; subCategory: string }>();
    const link = `/products${category ? `/${category}` : ""}${subCategory ? `/${subCategory}` : ""}/${product?.slug}?componentsVfproduct=${product?._id}`;

    return (
      <GridItem 
        borderRadius="md" 
        position="relative" 
        onClick={() => navigate(link)}
    >

        {/* <Icon as={FaStar} position="absolute" top="10px" left="10px" color="gray" /> */}
  
        <Box position="relative" _hover={{ "& .quick-view": { opacity: 1 } }}>
            <Image 
                src={product?.mainImage ?? noProductImage} 
                alt={product?.name} 
                borderRadius="md"
                transition="transform 0.3s"
                _hover={{ transform: "scale(1.05)" }}
                objectFit={'cover'}
                w={'100%'}
                h={['500px']}
            />
          
            <Button 
                className="quick-view" 
                position="absolute" 
                top="10px" 
                right="10px"
                bg="white" 
                opacity="0"
                _hover={{ bg: "gray.200" }}
                size="xs"
            >
                {product?.availability ? <Icon as={FaCheckToSlot} mr={1} color={'green'}/> : <Icon as={FcCancel} mr={1} />} {product?.availability ? "Available" : "Out of Stock"}
            </Button>
        </Box>
    
        {/* Product Info */}
        <Stack spacing={'-1'} mt={2}>
            {/* {product?.acceptCrypto && (
                <Text fontSize="xs" color="gray.500">WE ACCEPT CRYPTO</Text>
            )} */}
            <Text fontWeight={500}>{capCase(product?.name)}</Text>
            <Text fontSize="lg" fontWeight="bold">€ {moneyFormat(product?.price)}</Text>
        </Stack>
        
      </GridItem>
    );
};


  function ProductsMain() {

    const location = useLocation();
    const { queryParams } = useQueryParams()
    const { category } = useParams<{ category: string }>();

    const [searchParams] = useSearchParams();
    const categoryId = searchParams.get("componentsVfcategory");

    const [filter, setFilter] = useState({
        sortBy: 'recent',
        categoryId: categoryId ?? ""
    })

    const { data: productData = {}, isLoading } = useGetProducts({...filter, ...queryParams})
    const { data: products = {} } = productData

    useEffect(() => {
        setFilter((prev) => ({
          ...prev,
          categoryId: searchParams.get("componentsVfcategory") || "",
        }));
    }, [location.search]);

    return (
        <>
            <Flex
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
            </Flex>

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
                            <ProductGrid 
                                products={products?.products}
                                init={products}
                                filters={filter}
                                setFilters={setFilter}
                            />
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