import { Box, Button, FormControl, FormLabel, Heading, HStack, Input, SimpleGrid, Spinner, Stack, Text, useDisclosure } from "@chakra-ui/react"
import PageMainContainer from "../../common/PageMain"
import MainAppLayout from "../../layouts/MainAppLayout"
import { Container } from "../../styling/layout"
import AnimateRoute from "../../common/AnimateRoute"
import { useAddCollectionCategory, useAddCollectionSubCategory, useDeleteCollection, useGetProductCollections } from "../../hooks/products/collections"
import { MdAddToPhotos, MdOutlineArrowBackIos, MdOutlineSave } from "react-icons/md"
import { useNavigate } from "react-router"
import { Table, TableRow } from "../../common/Table/Table"
import { useState } from "react"
import { capCase, prettyDateFormat } from "../../utils/utils"
import { useConfirmAction } from "../../utils/useActions"
import Notify from "../../utils/notify"
import ConfirmModal from "../../common/ConfirmModal"
import ModalCenter from "../../common/ModalCenter"
import { TextDetails } from "../Order/MyOrder"


const tableHeads = ["S/N", "Name", "Created At", ""]
function AdminCategoryPageMain ({ categories = [], isLoading }: any) {

    const [data, setData] = useState<any>({})
    const [data2, setData2] = useState<any>({})
    const [selected, setSelected] = useState<any>({})
    const navigate = useNavigate()

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure()
    
    const { openConfirm, closeConfirm, isOpenConfirm, current } = useConfirmAction()

    const selectedInfo = (d: any) => {
        setSelected(d)
        onOpenEdit()
    }

    const { mutateAsync: deleteCategoryAction } = useDeleteCollection()    
    const { mutateAsync, isPending } = useAddCollectionCategory()
    const { mutateAsync: mutateAsyncSub, isPending: isPendingSub } = useAddCollectionSubCategory()

    const handleCategories = async (data: any) => {
        try {

            const payload: any = await mutateAsync(data)

            Notify.success("Success")
            onClose()
            
            setData((prev: any) => ({...prev, categoryName: "", subCategoryName: "" }))

            return payload;
        } catch (e:any) {
            Notify.error(e?.message ?? "Failed")
            return e
        }
    };

    const handleSubCategories = async (data2: any) => {
        try {

            const payload: any = await mutateAsyncSub(data2)

            Notify.success("Done")
            onCloseEdit()
            
            setData2((prev: any) => ({...prev, subCategoryName: "" }))

            return payload;
        } catch (e:any) {
            Notify.error(e?.message ?? "Failed")
            return e
        }
    };

    const shouldDelete = (data: any) => {
        openConfirm(data)
    }

    const handleDelete = async () => {
        try {
            const res:any =  await deleteCategoryAction({categoryId: current?._id})

            Notify.success("Deleted")
            return res;

        } catch(e:any) {
            
            Notify.error(e?.message ?? "Failed")
            return e
        }
    }

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
                    onClick={onOpen}
                    color={'white'}
                    bgColor={'blue.700'}
                >
                    Add
                </Button>
            </HStack>

            <Table
                headings={tableHeads}
                loading={isLoading}
                isEmpty={categories?.length <= 0}
                emptyText='No category found'
                pt={3}
                noIndexPad
            >
                {categories?.map((item:any, index:any) =>
                    <TableRow
                        key={index}
                        data={[
                            (index + 1 ),
                            capCase(item?.name) ?? "-",
                            prettyDateFormat(item?.createdAt ?? "-"),
                            // prettyDateFormat(item?.updatedAt ?? "-"),
                        ]}
                        noIndexPad
                        options={[
                            {name: "View", onUse: () => { selectedInfo(item) }},
                            {name: "Delete", color: 'red.700', onUse: () => shouldDelete(item)},
                        ]}
                    />
                )}
            </Table>

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
                                <Input
                                    name="categoryName" 
                                    value={data?.categoryName}
                                    onChange={ (e) => setData((prev: any) => ({...prev, categoryName: e.target.value })) }
                                    required
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Sub-category Name</FormLabel>
                                <Input
                                    name="subCategoryName" 
                                    value={data?.subCategoryName}
                                    onChange={ (e) => setData((prev: any) => ({...prev, subCategoryName: e.target.value })) }
                                    // required
                                />
                            </FormControl>

                            <HStack w={'full'} justify={'space-between'} spacing={3} mt={6}>
                                <Button 
                                    w={'100%'} 
                                    bg="gray.400" 
                                    onClick={onClose}
                                > 
                                    Back 
                                </Button>
                                <Button 
                                    w={'100%'}
                                    bg="blue.700" 
                                    type='submit'
                                    color="white" 
                                    isDisabled={isPending}
                                    isLoading={isPending}
                                >
                                    Save
                                </Button>
                                
                            </HStack>

                        </Stack>
                    </form>
                }
            />

            <ModalCenter 
                size={'2xl'}
                isOpen={isOpenEdit}
                onClose={onCloseEdit}
                header='View Category'
                body={
                    <>
                        {isPendingSub ?
                            <Box
                                position="fixed"
                                top={0}
                                left={0}
                                width="100vw"
                                height="100vh"
                                bg="rgba(255, 255, 255, 0.5)"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                zIndex={9999}
                            >
                                <Spinner size="xl" color="blue.500" thickness="4px" />
                            </Box> : null
                        }

                        <Box display='flex' gap={2} justifyContent='space-between' flexDirection='row'>
                            <Input placeholder={"Add Sub-catgeory"} onChange={ (e) => setData2((prev: any) => ({...prev, subCategoryName: e.target.value })) }/>
                            <Button color={'white'} bgColor={'blue.700'} leftIcon={<MdOutlineSave />} isLoading={isPendingSub} onClick={() => { handleSubCategories({...data2, categoryId: selected?._id}) }} />
                        </Box>
                        
                        <Stack mt={6} spacing={4}>

                            <Box borderBottom={'1px solid #ccc'} py={3}>
                                <Text fontSize={'18px'} fontWeight={500}>Category Details</Text>
                                <SimpleGrid columns={[2]} spacing={4} my={3}>
                                    <TextDetails title="Name" name={capCase(selected?.name)} />
                                    <TextDetails title="Created At" name={prettyDateFormat(selected?.createdAt)} />
                                    {/* <TextDetails title="Updated At" name={prettyDateFormat(selected?.updatedAt)} /> */}
                                </SimpleGrid>
                            </Box>

                            <Box >
                                <Text fontSize={'18px'} mb={3} fontWeight={500}>Sub Categories</Text>
                                {selected?.subcategories?.map((c:any, i:number) => (
                                    <Box key={i} borderBottom={'1px solid #eee'}>
                                        <SimpleGrid columns={[2]} spacing={4} py={3}>
                                            <TextDetails title="Name" name={capCase(c?.name)} />
                                            <TextDetails title="Created At" name={prettyDateFormat(c?.createdAt)} />
                                            {/* <TextDetails title="Updated At" name={prettyDateFormat(c?.updatedAt)} /> */}
                                        </SimpleGrid>
                                    </Box>
                                ))}
                            </Box>
                        </Stack>
                    </>
                }
            />

        </Box>
    )
}

export default function AdminCategoryPage() {

    const { data: collectionData = {}, isLoading } = useGetProductCollections({})
    const { data: categories = [] } = collectionData

    return (
        <PageMainContainer title='Product Category' description='Product Category'>
            <MainAppLayout noFooter>
                <Container>
                    <AnimateRoute>
                        <AdminCategoryPageMain 
                            isLoading={isLoading}
                            categories={categories ?? []}
                        />
                    </AnimateRoute>
                </Container>
            </MainAppLayout>
        </PageMainContainer>
    )
}
