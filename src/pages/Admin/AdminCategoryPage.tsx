import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Box, Button, FormControl, FormLabel, Heading, HStack, IconButton, Input, Skeleton, Stack, Text, Tooltip, useDisclosure, VStack } from "@chakra-ui/react"
import PageMainContainer from "../../common/PageMain"
import MainAppLayout from "../../layouts/MainAppLayout"
import { Container } from "../../styling/layout"
import AnimateRoute from "../../common/AnimateRoute"
import { useAddCollectionCategory, useAddCollectionSubCategory, useDeleteCollection, useDeleteSubCollection, useEditCollectionCategory, useEditCollectionSubCategory, useGetProductCollections } from "../../hooks/products/collections"
import { MdAddToPhotos, MdOutlineArrowBackIos } from "react-icons/md"
import { useNavigate } from "react-router"
import { useState } from "react"
import { capCase } from "../../utils/utils"
import { useConfirmAction } from "../../utils/useActions"
import Notify from "../../utils/notify"
import ConfirmModal from "../../common/ConfirmModal"
import ModalCenter from "../../common/ModalCenter"
import { MdOutlineAdd } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import EmptyListHero from "../../common/EmptyListHero"


const CategoryManager = ({categories, isLoading}:any) => {

    const navigate = useNavigate()

    const [l, setL] = useState(null)
    const [id, setId] = useState(null)
    const [data, setData] = useState<any>({})
    const [selected, setSelected] = useState<any>({})
    const [data2, setData2] = useState<any>({})

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure()
    
    const { openConfirm, closeConfirm, isOpenConfirm, current } = useConfirmAction()

    const selectedInfo = (d: any, level:any) => {
        setSelected(d)
        setData2((prev: any) => ({...prev, name: d?.name }))
        setL(level)
        onOpenEdit()
    }

    const openAdd = (level:any, id?: any) => {
        setL(level)
        setId(id)
        onOpen()
    }

    const shouldDelete = (data: any, level:any) => {
        openConfirm(data)
        setL(level)
    }

    const { mutateAsync, isPending } = useAddCollectionCategory()
    const { mutateAsync: mutateAsyncSub, isPending: isPendingSub } = useAddCollectionSubCategory()
    const { mutateAsync: editCategoryAction, isPending: isPendingEdit } = useEditCollectionCategory()
    const { mutateAsync: editSubCategoryAction, isPending: isPendingSubEdit } = useEditCollectionSubCategory()
    const { mutateAsync: deleteCategoryAction } = useDeleteCollection()    
    const { mutateAsync: deleteSubCategoryAction } = useDeleteSubCollection()   

    const handleCategories = async (data: any) => {
        try {
            const payload: any = l == -1 ? await mutateAsync(data) : await mutateAsyncSub({...data, categoryId: id})
            Notify.success("Success")
            setL(null)
            onClose()     
            // setData((prev: any) => ({...prev, categoryName: "", subCategoryName: "" }))
            setData({})
            return payload;
        } catch (e:any) {
            Notify.error(e?.message ?? "Failed")
            setL(null)
            onClose()
            // setData((prev: any) => ({...prev, categoryName: "", subCategoryName: "" }))
            setData({})
            return e
        }
    };

    const handleEditCategories = async (data2: any) => {
        try {
            const payload: any = l == 0 ? await editCategoryAction({...data2, categoryId: selected?._id}) : await editSubCategoryAction({...data2, categoryId: selected?.parent, subCategoryId: selected?._id})
            Notify.success("Success")
            setL(null)
            setSelected({})
            onCloseEdit()
            // l == 0 ? setData2((prev: any) => ({...prev, name: "", categoryId: null, })) : setData2((prev: any) => ({...prev, name: "", categoryId: null, subCategoryId: null, }))
            setData2({})
            return payload;
        } catch (e:any) {
            Notify.error(e?.message ?? "Failed")
            setL(null)
            setSelected({})
            onCloseEdit()
            setData2({})
            // l == 0 ? setData2((prev: any) => ({...prev, name: "", categoryId: null, })) : setData2((prev: any) => ({...prev, name: "", categoryId: null, subCategoryId: null, }))
            return e
        }
    };

    const handleDelete = async () => {
        try {
            const res:any = l === 0 ? await deleteCategoryAction({categoryId: current?._id}) : await deleteSubCategoryAction({subCategoryId: current?._id})
            Notify.success("Deleted")
            setL(null)
            return res;
        } catch(e:any) {
            Notify.error(e?.message ?? "Failed")
            setL(null)
            return e
        }
    }


    const renderAccordion = (data: any[], level = 0) => (
        <Accordion allowMultiple w="100%" >
            {data?.map((item, i) => (
                <AccordionItem key={i}>
                    <h2>
                        <AccordionButton>
                            <Box 
                                flex="1" 
                                textAlign="left"
                                fontWeight={level == 0 ? 700 : level == 1 ? 500 : 400}
                                fontSize={level == 0 ? '20px' : level == 1 ? '16px' : '13px'}
                            >
                                {capCase(item?.name)}
                            </Box>
                                <HStack spacing={[1,3]}>
                                    {level < 2 &&
                                        <Tooltip label='Add'>
                                            <IconButton
                                                size="sm"
                                                icon={<MdOutlineAdd />}
                                                aria-label="Add Sub"
                                                onClick={(e:any) => {e.stopPropagation(); openAdd(level, item?._id)}}
                                            />
                                        </Tooltip>
                                    }
                                    <Tooltip label='Edit'>
                                        <IconButton
                                            size="sm"
                                            icon={<FaRegEdit />}
                                            aria-label="Edit"
                                            onClick={(e:any) => {e.stopPropagation(); selectedInfo(item, level)}}
                                        />
                                    </Tooltip>
                                    <Tooltip label='Delete'>
                                        <IconButton
                                            size="sm"
                                            icon={<RiDeleteBin5Fill />}
                                            aria-label="Delete"
                                            colorScheme="red"
                                            onClick={(e:any) => {e.stopPropagation(); shouldDelete(item, level);}}
                                        />
                                    </Tooltip>
                                </HStack>

                        </AccordionButton>
                    </h2>

                    <AccordionPanel pb={4}>
                        {item.subcategories && item.subcategories.length > 0
                            ? renderAccordion(item.subcategories, level + 1)
                            : <Text fontSize="sm" color="gray.500">No subcategories</Text>}
                    </AccordionPanel>

                </AccordionItem>
            ))}
        </Accordion>
    );

    return (
        <Box py={6}>
            <Heading textAlign="center" fontSize={["24px", '30px']} fontWeight={400} my={10}> CATEGORIES </Heading>

            <HStack justify={'space-between'} w='100%'>
                <Button
                    leftIcon={<MdOutlineArrowBackIos />}
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    mt={4}
                    mb={4}
                    textDecor={'underline'}
                >
                    Back
                </Button>

                <Button
                    leftIcon={<MdAddToPhotos />}
                    onClick={() => openAdd(-1)}
                    color={'white'}
                    bgColor={'blue.700'}
                >
                    Add
                </Button>
            </HStack>
            
            <VStack align="start" mt={6} px={[0, 4]}>
                {isLoading ? (
                    <Box>
                        <Box w='full' borderRadius='md' py={2}>
                            <Skeleton borderRadius='md' h='50px' mb={2} />
                            <Skeleton borderRadius='md' h='50px' mb={2}/>
                            <Skeleton borderRadius='md' h='50px' mb={2}/>
                        </Box>
                    </Box>
                    ) : categories.length > 0 ? renderAccordion(categories) 
                    : <EmptyListHero text={'No categories found.'} />
                }
            </VStack>

            <ConfirmModal
                isOpen={isOpenConfirm}
                onConfirm={handleDelete}
                onClose={closeConfirm}
            />

            <ModalCenter 
                isOpen={isOpen}
                onClose={onClose}
                header='Add Category'
                body={
                    <form onSubmit={(e) => { e?.preventDefault(); handleCategories(data); }}>
                        <Stack spacing={4}>
                            <FormControl>
                                <FormLabel>* Category Name</FormLabel>
                                {l == -1 ?
                                    <Input
                                        name="categoryName" 
                                        value={data?.categoryName}
                                        onChange={ (e) => setData((prev: any) => ({...prev, categoryName: e.target.value })) }
                                        required
                                    /> :
                                    <Input
                                        name="subCategoryName" 
                                        value={data?.subCategoryName}
                                        onChange={ (e) => setData((prev: any) => ({...prev, subCategoryName: e.target.value })) }
                                        required
                                    />
                                }
                            </FormControl>


                            <HStack w={'full'} justify={'space-between'} spacing={3} mt={6}>
                                <Button 
                                    w={'100%'} 
                                    bg="gray" 
                                    onClick={onClose}
                                > 
                                    Back 
                                </Button>
                                <Button 
                                    w={'100%'}
                                    bg="blue.700" 
                                    type='submit'
                                    color="white" 
                                    isDisabled={isPending || isPendingSub}
                                    isLoading={isPending || isPendingSub}
                                >
                                    Save
                                </Button>
                                
                            </HStack>

                        </Stack>
                    </form>
                }
            />

            <ModalCenter 
                isOpen={isOpenEdit}
                onClose={onCloseEdit}
                header='Edit Category'
                body={
                    <form onSubmit={(e) => { e?.preventDefault(); handleEditCategories(data2); }}>
                        <Stack spacing={4}>
                            <FormControl>
                                <FormLabel>* Category Name</FormLabel>
                                    <Input
                                        name="name" 
                                        value={data2?.name}
                                        onChange={ (e) => setData2((prev: any) => ({...prev, name: e.target.value })) }
                                        required
                                    />
                            </FormControl>


                            <HStack w={'full'} justify={'space-between'} spacing={3} mt={6}>
                                <Button 
                                    w={'100%'} 
                                    bg="gray" 
                                    onClick={onCloseEdit}
                                > 
                                    Back 
                                </Button>
                                <Button 
                                    w={'100%'}
                                    bg="blue.700" 
                                    type='submit'
                                    color="white" 
                                    isDisabled={isPendingEdit || isPendingSubEdit}
                                    isLoading={isPendingEdit || isPendingSubEdit}
                                >
                                    Save
                                </Button>
                                
                            </HStack>

                        </Stack>
                    </form>
                }
            />

        </Box>
    );
};












export default function AdminCategoryPage() {

    const { data: collectionData = {}, isLoading } = useGetProductCollections({})
    const { data: categories = [] } = collectionData

    return (
        <PageMainContainer title='Product Category' description='Product Category'>
            <MainAppLayout noFooter>
                <Container>
                    <AnimateRoute>
                        <CategoryManager 
                            isLoading={isLoading}
                            categories={categories ?? []}
                        />
                    </AnimateRoute>
                </Container>
            </MainAppLayout>
        </PageMainContainer>
    )
}
