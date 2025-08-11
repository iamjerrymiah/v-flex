import { Box, Button, Checkbox, FormControl, FormLabel, Heading, HStack, Input, Select, SimpleGrid, Stack, Text, Textarea } from '@chakra-ui/react'
import AnimateRoute from '../../common/AnimateRoute'
import PageMainContainer from '../../common/PageMain'
import MainAppLayout from '../../layouts/MainAppLayout'
import { Container } from '../../styling/layout'
import { useEffect, useState } from 'react'
import { MdOutlineArrowBackIos } from 'react-icons/md'
import { useNavigate } from 'react-router'
import { productSchema } from '../../schema/auth'
import { Field, Form, Formik } from 'formik'
import Notify from '../../utils/notify'
import { useAddProductImages, useCreateProduct } from '../../hooks/products/products'
import { useGetProductCollections } from '../../hooks/products/collections'
import CreatableSelect from 'react-select/creatable';
import ReactSelect from 'react-select';
import ImageUploader from '../../common/ImageUploader'
import { capCase, isSuperUser } from '../../utils/utils'
import { useGetAuthState } from '../../hooks/auth/AuthenticationHook'
import Loader from '../../common/Loader'

export interface AdminCreateProductProps {
    steps: { component: React.ComponentType; label: string }[];
    currentStep: number;
    product?: any;
    isLoading?: boolean;
    goToPrevStep: () => void;
    goToNextStep: () => void;
}


function AdminCreateProductMain ({
    steps,
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
                currentStep={currentStep}
                goToPrevStep={goToPrevStep}
                goToNextStep={goToNextStep}
            />
        </Box>
    )
}

export default function AdminCreateProductPage() {

    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
      { component: CreateProduct, label: "Step 1" },
      { component: ProductImages, label: "Step 2" },
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
            {/* {isAdmin &&  */}
                <PageMainContainer title='Products' description='Products'>
                    <MainAppLayout noFooter>
                        <Container>
                            <AnimateRoute>
                                <AdminCreateProductMain 
                                    steps={steps}
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


function CreateProduct ({ 
    // currentStep,
    // goToPrevStep,
    // res,
    setRes,
    goToNextStep 
}: any) {

    const navigate = useNavigate()

    const { data: collectionData = {} } = useGetProductCollections({})
    const { data: categories = [] } = collectionData

    const { mutateAsync, isPending } = useCreateProduct()
    const handleProduct = async (data: any) => {
        try {
            const payload: any = await mutateAsync({ ...data, image: file })
            setRes(payload)
            Notify.success("Product Successfully Created!")
            goToNextStep()
            return payload;
        } catch (e:any) {
            Notify.error(e?.message ?? "Failed")
            return e
        }
    };

    const [file, setFile] = useState(null)

    const flattenSubcategories = (subcategories: any[], parentName: string = ""): any[] => {
        let result: any[] = [];

        subcategories.forEach(sub => {
            const label = parentName 
                ? `${sub?.name} (${parentName})`
                : sub?.name;

            result.push({
                _id: sub?._id,
                name: label,
                parent: sub?.parent
            });

            if (sub.subcategories && sub.subcategories.length > 0) {
                result = result.concat(flattenSubcategories(sub.subcategories, sub?.name));
            }
        });

        return result;
    };

    const numberHundredArray = Array(100).fill(1).map((n, i) => n + i)
    
    return (
        <Box w='full' py={6}>

            <Heading textAlign="center" fontSize={["24px", '30px']} fontWeight={400} mb={10}> CREATE PRODUCT </Heading>

            <HStack justify={'space-between'} w={'100%'} my={4}>
                <Button
                    leftIcon={<MdOutlineArrowBackIos />}
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    textDecor={'underline'}
                >
                    Back
                </Button>
            </HStack>

            <Formik
                initialValues={{
                    name: "",
                    price: "",
                    quantity: "",
                    sizes: "",
                    colors: "",
                    freeShipping: false,
                    availability: true,
                    category: "",
                    subCategories: "",
                    discount: "",
                    description: ""
                }}
                validationSchema={productSchema}
                onSubmit={async (values, actions) => {
                    await handleProduct(values)
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
                    <Form onSubmit={handleSubmit}>

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
                                        label: capCase(cat.name),
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
                                        label: capCase(sub.name),
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
                                    value={(values?.colors || '').split(', ').filter(c => c).map(color => ({ label: color, value: color }))}
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
                                    value={(values?.sizes || '').split(',').filter(c => c).map(size => ({ label: size, value: size }))}
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
                                <FormLabel fontWeight={700}>Discount</FormLabel>
                                <Select name="discount" value={values?.discount} onChange={handleChange}>
                                    {numberHundredArray?.map((status:any, i) => ( <option key={i} value={status}>{capCase(status)} </option> ))}
                                </Select>
                                {errors?.discount && <Text fontSize={'12px'} color={'red.400'}>{`${errors?.discount}`}</Text>}
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
                            <FormControl w={['100%', '100%', '100%', '60%']} mb={4}>
                                <ImageUploader 
                                    file={file}
                                    onRemove={() => { setFile(null) }}
                                    onUpload={(file:any) => setFile(file)} 
                                    msg='Please Select Main Image'
                                />
                            </FormControl>
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
                                // bg="black" 
                                colorScheme='facebook'
                                type='submit'
                                color="white" 
                                // _hover={{ bg: "gray" }}
                                w={['100%', '20%']}
                                isDisabled={ isSubmitting  || isPending || file === null}
                                isLoading={isSubmitting || isPending}
                            >
                                Submit
                            </Button>
                            
                        </HStack>

                    </Form>
                )}}

            </Formik>
            
        </Box>
    )
}


export function ProductImages({ 
    // edit,
    res,
}: any) {

    const navigate = useNavigate()
    
    const { mutateAsync, isPending } = useAddProductImages({ productId: res?.data?._id })

    const [images, setImages] = useState<(File | null)[]>([null, null, null, null, null]); // 5 slots
  
    const handleUpload = (index: number, file: File) => {
        const newImages = [...images];
        newImages[index] = file;
        setImages(newImages);
    };
  
    const handleRemove = (index: number) => {
        const newImages = [...images];
        newImages[index] = null;
        setImages(newImages);
    };

    const handleProductImages = async () => {
        try {
            const data: any = {};
        
            images.forEach((file) => {
                if (file) {
                if (!data['images']) data['images'] = [];
                    data['images'].push(file);
                }
            });
        
            const payload = await mutateAsync(data);
        
            Notify.success('Success!');
            navigate('/vl/admin/products');
            return payload;
        } catch (e: any) {
            Notify.error(e?.message ?? "Failed")
            return e;
        }
    };
  
    return (
      <Box w="full" py={10}>
            <Heading textAlign="center" fontSize={["24px", "30px"]} fontWeight={400} mb={10}> ADD OTHER IMAGES</Heading>
    
            <SimpleGrid columns={[1, 1, 1, 2]} spacing={6}>
                {images.map((img, idx) => (
                    <Box key={idx}>
                        <ImageUploader
                            file={img}
                            onUpload={(file: any) => handleUpload(idx, file)}
                            onRemove={() => handleRemove(idx)}
                        />
                    </Box>
                ))}
            </SimpleGrid>

            <HStack w={'full'} justify={'flex-end'} mt={12}>
                <Button 
                    // bg="black" 
                    colorScheme='facebook'
                    color="white" 
                    // _hover={{ bg: "gray" }}
                    w={['100%', '20%']}
                    isDisabled={ isPending}
                    isLoading={ isPending}
                    onClick={() => handleProductImages()}
                >
                    Finish
                </Button>
                
            </HStack>
      </Box>
    );
}










{/* <ReactSelect
    isMulti
    name="sizes"
    options={sizeOptions.map((size: string) => ({
    value: size,
    label: size,
    }))}
    value={values?.sizes
    ?.split(',')
    .map((size: string) => size.trim())
    .filter((size: string) => size)
    .map((size: string) => ({
        value: size,
        label: size,
    }))
    }
    onChange={(selectedOptions: any) => {
    const selectedSizes = selectedOptions.map((option: any) => option.value).join(',');
    setFieldValue('sizes', selectedSizes);
    }}
    placeholder="Select Sizes"
/>
{errors?.sizes && (
    <Text fontSize="12px" color="red.400">{`${errors.sizes}`}</Text>
)} */}
