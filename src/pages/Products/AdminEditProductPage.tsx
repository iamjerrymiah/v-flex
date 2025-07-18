import { useEffect, useState } from "react";
import { AdminCreateProductProps } from "./AdminCreateProductPage"
import { Box, Button, Checkbox, Divider, FormControl, FormLabel, Grid, Heading, HStack, Image, Input, SimpleGrid, Stack, Text, Textarea } from "@chakra-ui/react";
import PageMainContainer from "../../common/PageMain";
import MainAppLayout from "../../layouts/MainAppLayout";
import { Container } from "../../styling/layout";
import AnimateRoute from "../../common/AnimateRoute";
import { useNavigate, useParams } from "react-router";
import { useAddProductImages, useDeleteProductImage, useGetProduct, useUpdateProduct, useUpdateProductMainImage } from "../../hooks/products/products";

import noProductImg from '../../assets/icons/noproduct.png'
import { MdOutlineArrowBackIos } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { capCase, isSuperUser, moneyFormat } from "../../utils/utils";
import PageSk from "../../common/PageSk";
import { useGetProductCollections } from "../../hooks/products/collections";
import { Field, Form, Formik } from "formik";
import { productSchema } from "../../schema/auth";
import CreatableSelect from 'react-select/creatable';
import ReactSelect from 'react-select';
import EditImageUploader from "../../common/EditImageUploader";
import Notify from "../../utils/notify";
import { useGetAuthState } from "../../hooks/auth/AuthenticationHook";
import Loader from "../../common/Loader";

const emptyProduct = {
    name: "-",
    category: "-",
    price: "-",
    mainImage: noProductImg,
    description: "",
    images: [],
    details: [],
    colors: [],
    sizes: []
};

function AdminEditProductMain({
    steps,
    isLoading,
    product = {},
    currentStep,
    goToPrevStep,
    goToNextStep,
}: AdminCreateProductProps) {
    // const totalSteps = steps.length;
    const StepComponent:any = steps[currentStep].component;
    const [res, setRes] = useState({})

    return (
        <Box w='full'>
            <StepComponent 
                res={res}
                setRes={setRes}
                steps={steps}
                product={product}
                isLoading={isLoading}
                currentStep={currentStep}
                goToPrevStep={goToPrevStep}
                goToNextStep={goToNextStep}
            />
        </Box>
    )
}

export default function AdminEditProductPage() {

    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { data: productData = {}, isLoading: productLoad } = useGetProduct(id)
    const product = productData?.data

    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        { component: ViewProduct, label: "Step 1" },
        { component: EditProduct, label: "Step 2" },
    ];
  
    const goToNextStep = () => { if (currentStep < steps.length - 1) { setCurrentStep(currentStep + 1); } };
    const goToPrevStep = () => { if (currentStep > 0) { setCurrentStep(currentStep - 1); } };

    const { isLoading, isAuthenticated, user } = useGetAuthState()
    const isAdmin = isSuperUser(user?.role)
    useEffect(() => { if(!isLoading && isAuthenticated == false) { navigate('/products/vl') } }, [isLoading, isAuthenticated])
    useEffect(() => { if(!isLoading && isAdmin == false && isAuthenticated == true ) {navigate('/profile'); Notify.error("Not Authorized!!")} }, [isLoading, isAuthenticated])
    if(isLoading) { return (<Loader />) }

    return (
        <>
            {/* {isAdmin && */}
                <PageMainContainer title='Products' description='Products'>
                    <MainAppLayout noFooter>
                        <Container>
                            <AnimateRoute>
                                <AdminEditProductMain 
                                    steps={steps}
                                    isLoading={productLoad}
                                    product={product ?? emptyProduct}
                                    currentStep={currentStep}
                                    goToPrevStep={goToPrevStep}
                                    goToNextStep={goToNextStep}
                                />
                            </AnimateRoute>
                        </Container>
                    </MainAppLayout>
                </PageMainContainer>
            {/* } */}
        </>
    )
}

function ViewProduct({ 
    // setRes,
    isLoading,
    product,
    goToNextStep 
}: any) {

    const navigate = useNavigate()
    if(isLoading) {<PageSk />}

    return (

        <Box w='full' py={6}>
            <Heading textAlign="center" fontSize={["24px", '30px']} fontWeight={400} mb={10}> VIEW PRODUCT </Heading>

            <HStack justify={'space-between'} w={'100%'} my={4}>
                <Button
                    leftIcon={<MdOutlineArrowBackIos />}
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    textDecor={'underline'}
                >
                    Back
                </Button>

                {product?.mainImage && product?.name &&
                    <HStack>
                        <Button
                            leftIcon={<FaRegEdit />}
                            onClick={() => goToNextStep()}
                            color={'white'}
                            bgColor={'blue.700'}
                        >
                            Edit
                        </Button>
                    </HStack>
                }
            </HStack>

            <Grid templateColumns={{ base: "1fr", md: "1fr", lg: "1.5fr 1fr" }} gap={10}>
                {/* Left: Images */}
                <Box>
                    <HStack spacing={2} overflowX="auto" className="scroll-custom">
                        {product.images.map((img:any, idx:any) => (
                            <Image
                                key={idx}
                                src={img}
                                boxSize="100px"
                                borderRadius="md"
                                objectFit="cover"
                            />
                        ))}
                    </HStack>
                    <Image
                        src={product?.mainImage}
                        borderRadius="md"
                        objectFit={'contain'}
                        w={["100%", '700px']}
                        h={["auto", '400px']}
                    />
                </Box>

                {/* Right: Product Info */}
                <Box>
                    <Stack spacing={5}>
                        <Text fontWeight="bold" fontSize="2xl">{capCase(product?.name)}</Text>
                        <Text> <b>Price:</b> € {moneyFormat(product?.price ?? 0)}</Text>
                        <Text> <b>Quantity:</b> {product?.quantity} </Text>
                        <Text> <b>Availability:</b> {" "} {product?.availability ? "✅ YES" : "❌ Out of Stock"}  </Text>
                        <Text> <b>Sizes:</b> {product?.sizes?.join(", ").toUpperCase()}</Text>
                        <Text> <b>Colors:</b> {capCase(product?.colors?.join(", "))} </Text>
                        <Text> <b>Free Shipping:</b> {product?.freeShipping ? "✅ YES" : "❌ NO"} </Text>
                        <Text> <b>Disabled:</b> {product?.disabled ? "✅ YES" : "❌ NO"} </Text>
                        <Text> <b>Sales Count:</b> {product?.salesCount} </Text>
                        <Box>
                            <Text fontWeight="bold" mb={1}>Description: </Text>
                            <Text noOfLines={5}>{product?.description}</Text>
                        </Box>
                    </Stack>

                    <Divider my={4} />

                </Box>
            </Grid>
        </Box> 
    )
}

function EditProduct({ 
    // res,
    product,
    goToPrevStep
}: any) {

    const { data: collectionData = {} } = useGetProductCollections({})
    const { data: categories = [] } = collectionData

    const { mutateAsync, isPending } = useUpdateProduct()
    const handleEditProduct = async (data: any) => {
        try {
            const payload: any = await mutateAsync({...data, productId: product?._id})
            Notify.success("Success!")
            return payload;
        } catch (e:any) {
            Notify.error(e?.message ?? "Failed")
            return e
        }
    }

    const flattenSubcategories = (subcategories: any[]): any[] => {
        let result: any[] = [];

        subcategories.forEach(sub => {
        result.push({
            _id: sub?._id,
            name: sub?.name,
            parent: sub?.parent
        });

        if (sub.subcategories && sub.subcategories.length > 0) {
            result = result.concat(flattenSubcategories(sub.subcategories));
        }
        });

        return result;
    };

    const [mainImage, setMainImage] = useState<{ file: File | null, preview: string } | null>({file:null, preview: product?.mainImage});
    const [imageUrlArray, setImageUrlArray] = useState<any[]>(product?.images ?? []);

    const { mutateAsync:deleteImageUrl, isPending: deletePending } = useDeleteProductImage()
    const handleImageDelete = async (index: number) => {
        const removedImageUrl = imageUrlArray[index]; // <-- Get the image being removed
        const updated = [...imageUrlArray];
        updated.splice(index, 1);
        setImageUrlArray(updated);

        try {
            const payload: any = await deleteImageUrl({productId: product?._id, imageUrls: [removedImageUrl]})
            Notify.success("Success!")
            return payload;
        } catch (e:any) {
            Notify.error(e?.message ?? "Failed")
            return e
        }
    };

    const handleMainImageChange = (file: File) => {
        const previewUrl = URL.createObjectURL(file);
        setMainImage({ file, preview: previewUrl });
    };

    const handleImageArrayChange = (index: number, file: File) => {
        const preview = URL.createObjectURL(file);
        const updated = [...imageUrlArray];
        updated[index] = { file, preview };
        setImageUrlArray(updated);
    };

    const { mutateAsync: imagesUploadAction, isPending: isPendingImages } = useAddProductImages({ productId: product?._id })
    const handleSaveImageArray = async () => {
        const files = imageUrlArray?.map((img) => img.file);
        // upload files
        try {
            const payload: any = await imagesUploadAction({images: files})
            Notify.success("Success!")
            return payload;
        } catch (e:any) {
            Notify.error(e?.message ?? "Failed")
            return e
        }
    };


    const { mutateAsync: mainImageAction, isPending: isPendingMainImage } = useUpdateProductMainImage(product?._id)
    const handleMainImage = async () => {
        try {
            const payload: any = await mainImageAction({image: mainImage?.file})
            Notify.success("Success!")
            return payload;
        } catch (e:any) {
            Notify.error(e?.message ?? "Failed")
            return e
        }
    }

    return (
        <Box w='full' py={6}>
            <Heading textAlign="center" fontSize={["24px", '30px']} fontWeight={400} mb={10}> EDIT PRODUCT </Heading>

            <HStack justify={'space-between'} w={'100%'} my={4}>
                <Button
                    leftIcon={<MdOutlineArrowBackIos />}
                    variant="ghost"
                    onClick={() => goToPrevStep()}
                    textDecor={'underline'}
                >
                    Back
                </Button>
            </HStack>

            <Formik
                initialValues={{
                    name: product?.name ?? "",
                    price: product?.price ?? "",
                    quantity: product?.quantity ?? "",
                    sizes: product?.sizes?.join(", ") ?? "",
                    colors: product?.colors?.join(", ") ?? "",
                    freeShipping: product?.freeShipping ?? false,
                    availability: product?.availability ?? true,
                    category: product?.categoryId ?? "",
                    subCategories: product?.subCategories ?? "",
                    description: product?.description ?? ""
                }}
                validationSchema={productSchema}
                onSubmit={async (values, actions) => {
                    await handleEditProduct(values)
                    actions.setSubmitting(false); 
                }}
            >
                {({                         
                    handleChange,
                    values,
                    isSubmitting,
                    // touched,
                    errors,
                    setFieldValue,
                    handleSubmit, 
                }) => {

                    const selectedCategory = categories?.find((cat: any) => cat._id === values?.category);
                    const allSubcategories = selectedCategory ? flattenSubcategories(selectedCategory.subcategories) : [];
                    
                    return (
                    <Form style={{ paddingBottom: '20px', borderBottom: '1px solid gray' }} onSubmit={handleSubmit}>

                        <SimpleGrid columns={[ 1, 2, 2, 3 ]} spacing={6}>

                            <FormControl>
                                <FormLabel fontWeight={700}>* Product Name</FormLabel>
                                <Input
                                    name="name" 
                                    value={values?.name}
                                    onChange={handleChange}
                                    required
                                />
                                {errors?.name && <Text fontSize={'12px'} color={'red.400'}>{`${errors?.name}`}</Text>}
                            </FormControl>

                            <FormControl>
                                <FormLabel fontWeight={700}>* Price</FormLabel>
                                <Input
                                    name="price" 
                                    value={values?.price}
                                    onChange={handleChange}
                                    type='number'
                                    required
                                />
                                {errors?.price && <Text fontSize={'12px'} color={'red.400'}>{`${errors?.price}`}</Text>}
                            </FormControl>

                            <FormControl>
                                <FormLabel fontWeight={700}>* Quantity</FormLabel>
                                <Input
                                    name="quantity" 
                                    value={values?.quantity}
                                    onChange={handleChange}
                                    type='number'
                                    required
                                />
                                {errors?.quantity && <Text fontSize={'12px'} color={'red.400'}>{`${errors?.quantity}`}</Text>}
                            </FormControl>

                            <FormControl>
                                <FormLabel fontWeight={700}>* Categories</FormLabel>
                                <ReactSelect
                                    name="category"
                                    options={categories?.map((cat: any) => ({
                                        value: cat._id,
                                        label: cat.name,
                                    }))}
                                    value={categories
                                        ?.filter((cat: any) => cat._id === values?.category)
                                        ?.map((cat: any) => ({
                                            value: cat._id,
                                            label: cat.name,
                                        }))[0] || null
                                    }
                                    onChange={(selectedOption: any) => {
                                        setFieldValue('category', selectedOption?.value ?? null);
                                    }}
                                    placeholder="Select Category"
                                />
                                {errors?.category && (<Text fontSize="12px" color="red.400">{`${errors.category}`}</Text>)}
                            </FormControl>

                            <FormControl>
                                <FormLabel fontWeight={700}>Sub Categories</FormLabel>
                                <ReactSelect
                                    name="subCategories"
                                    options={allSubcategories.map((sub: any) => ({
                                        value: sub._id,
                                        label: sub.name,
                                        parent: sub.parent
                                    }))}
                                    value={
                                        (() => {
                                            if (!values?.subCategories) return null;
                                            const parts = values.subCategories.split(',').map((s: string) => s.trim());
                                            const subId = parts[1] ?? parts[0];
                                            const selected = allSubcategories.find((sub: any) => sub._id === subId);
                                            return selected ? { value: selected._id, label: selected.name, parent: selected.parent } : null;
                                        })()
                                    }
                                    onChange={(selectedOption: any) => {
                                        setFieldValue('subCategories', `${selectedOption?.parent ?? ""}, ${selectedOption?.value ?? ""}`);
                                    }}
                                    placeholder="Select Sub-category"
                                />
                                {errors?.subCategories && (<Text fontSize="12px" color="red.400">{`${errors.subCategories}`}</Text>)}
                            </FormControl>

                            <FormControl>
                                <FormLabel fontWeight={700}>* Colors</FormLabel>

                                <CreatableSelect
                                    isMulti
                                    required
                                    placeholder="Type and press enter..."
                                    value={(values?.colors || '').split(', ').filter((c:any) => c).map((color:any) => ({ label: color, value: color }))}
                                    onChange={(selectedOptions:any) => {
                                    const colorsString = selectedOptions.map((option:any) => option.value).join(', ');
                                        setFieldValue('colors', colorsString);
                                    }}
                                    styles={{
                                    control: (base:any) => ({
                                        ...base,
                                        borderColor: errors?.colors ? "red" : base.borderColor,
                                    }),
                                    }}
                                />

                                {errors?.colors && (<Text fontSize="12px" color="red.400"> {`${errors?.colors}`} </Text>)}
                            </FormControl>

                            <FormControl>
                                <FormLabel fontWeight={700}>* Sizes</FormLabel>
                                <CreatableSelect
                                    isMulti
                                    required
                                    placeholder="Type and press enter..."
                                    value={(values?.sizes || '').split(',').filter((c:any) => c).map((size:any) => ({ label: size, value: size }))}
                                    onChange={(selectedOptions:any) => {
                                    const sizeString = selectedOptions.map((option:any) => option.value).join(',');
                                        setFieldValue('sizes', sizeString);
                                    }}
                                    styles={{
                                    control: (base:any) => ({
                                        ...base,
                                        borderColor: errors?.colors ? "red" : base.borderColor,
                                    }),
                                    }}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel fontWeight={700}>* Description</FormLabel>
                                <Textarea
                                    height={'150px'}
                                    name="description" 
                                    value={values?.description}
                                    onChange={handleChange}
                                    required
                                />
                                {errors?.description && <Text fontSize={'12px'} color={'red.400'}>{`${errors?.description}`}</Text>}
                            </FormControl>


                        </SimpleGrid>

                        <Stack w={'100%'} mt={10} spacing={6}>
                            <FormControl>
                                <Field name="availability">
                                    {({ field }:any) => (
                                        <Checkbox {...field} isChecked={values?.availability}>Is This Product Available ?</Checkbox>
                                    )}
                                </Field>
                            </FormControl>

                            <FormControl>
                                <Field name="freeShipping">
                                    {({ field }:any) => (
                                        <Checkbox {...field} isChecked={values?.freeShipping}>Is This Product for Free Shipping ?</Checkbox>
                                    )}
                                </Field>
                            </FormControl>
                        </Stack>

                        <HStack w={'full'} justify={'flex-end'} mt={12}>
                            <Button 
                                bg="black" 
                                type='submit'
                                color="white" 
                                _hover={{ bg: "gray" }}
                                w={['100%', '20%']}
                                isDisabled={ isSubmitting  || isPending}
                                isLoading={isSubmitting || isPending}
                            >
                                Submit
                            </Button>
                            
                        </HStack>

                    </Form>
                )}}

            </Formik>

            <Box pt={8}>
                <Text fontSize={["16px", '24px']} fontWeight={400} mb={4}>GALLERY</Text>
            </Box>

            <Box>
                <EditImageUploader
                    mainImage={mainImage}
                    imageUrlArray={imageUrlArray}
                    // onMainImageDelete={handleMainImageDelete}
                    onMainImageChange={handleMainImageChange}
                    onDelete={handleImageDelete}
                    isLoading={isPendingMainImage}
                    isLoadingDelete={deletePending}
                    isLoadingImages={isPendingImages}
                    onSaveMainImage={handleMainImage}
                    onSaveImageArray={handleSaveImageArray}
                    // onImagesSave={onImagesSave}
                    onChange={handleImageArrayChange}
                    setImageUrlArray={setImageUrlArray}
                />
            </Box>

        </Box>
    )
}