import { HStack, Box, Input, Stack, Button, SimpleGrid, useDisclosure, Select, useBreakpointValue, Tooltip } from '@chakra-ui/react';
import { useCategoryContext } from '../../../providers/CategoryContext';
import { capCase } from '../../../utils/utils';
import { IoReloadCircle } from "react-icons/io5";
import { TbFiltersFilled } from "react-icons/tb";
import { BsSearch } from 'react-icons/bs';
import Drawer from '../../../common/Drawer';
import { MdLockReset } from 'react-icons/md';
import { IoMdMenu } from 'react-icons/io';
import Sidebar from '../../../layouts/components/Header/sidebar';

interface TopNavProps {
  categories: any[];
  admin?: boolean;
  filter?: any;
  setFilter?: any;
  search?: any;
  setSearch?: any;
}

const TopNav: React.FC<TopNavProps> = ({ categories, admin, filter, setFilter, search, setSearch }) => {

    const { topCategory, setTopCategory, setSubCategory, setLinkCategory } = useCategoryContext();
    
    const isMobile = useBreakpointValue({ base: true, md: false });
    const { isOpen, onToggle, onClose } = useDisclosure()
    const { isOpen: isOpenFilter, onOpen: onOpenFilter, onClose: onCloseFilter } = useDisclosure()

    const handleTopClick = (cat: any) => {
        setTopCategory(cat);
        setSubCategory(null);
        setLinkCategory(null)
    };

    const resetFilter = () => {
        // setFilter((prev:any) => ({ ...prev, categoryId: null }))
        setFilter({ sortBy: 'recent' })
        setTopCategory(null);
        setSubCategory(null);
        setLinkCategory(null)
    }

    const onFilter = () => {
        setFilter({ ...filter, ...search });
        onCloseFilter()
        setSearch((prev: any) => ({
            ...prev, 
            minPrice: "",
            maxPrice: "",
            sortBy: "",
            order: "",
        }))
    } 

    const onSearch = () => {
        setFilter({ ...filter, ...search, categoryId: null });
        onCloseFilter()
        setTopCategory(null);
        setSubCategory(null);
        setLinkCategory(null)
        setSearch((prev: any) => ({
            ...prev, 
            search: "",  
        }))
    } 

    return (
        <Stack pt={4} pb={2} justify={'space-between'} spacing={4} direction={['column', 'row']}>
            {!isMobile &&
                <HStack>
                    <Tooltip label='Refresh'><IoReloadCircle size={30} cursor={'pointer'} onClick={() => resetFilter()}/></Tooltip>
                    {categories.map((cat) => (
                        <Box
                            key={cat._id}
                            p={2}
                            fontSize={['14px', '18px']}
                            fontWeight={600}
                            bgColor={topCategory?._id === cat._id ? 'black' : 'white'}
                            color={topCategory?._id === cat._id ? 'white' : 'black'}
                            onClick={() => handleTopClick(cat)}
                            cursor={'pointer'}
                            _hover={{ bgColor: 'black', color: 'white' }}
                        >
                            {capCase(cat?.name)}
                        </Box>
                    ))}
                </HStack>
            }

            {!admin ? 
                <HStack spacing={4}>
                    {categories?.length > 0 && isMobile &&
                        <IoMdMenu 
                            cursor={'pointer'} 
                            onClick={onToggle} 
                            size={30} 
                        />
                    }

                    {isMobile &&  <Tooltip label='Refresh'><IoReloadCircle size={30} cursor={'pointer'} onClick={() => resetFilter()}/></Tooltip>}

                    <Button
                        leftIcon={<TbFiltersFilled size={20}/>}
                        onClick={onOpenFilter}
                        color={'black'}
                        variant={isMobile ? 'outline' : 'ghost'}
                        size={'lg'}
                    >
                        Filter
                    </Button>

                    <HStack>
                        <Input border={'1px solid gray'} placeholder={"Search any product"} onChange={ (e) => setSearch((prev: any) => ({...prev, search: e.target.value })) }/>
                        <Button leftIcon={<BsSearch />} color={'white'} bgColor={'blackAlpha.800'} onClick={onSearch} />
                    </HStack>

                </HStack> : null
            }

            <Drawer 
                placement={'left'}
                size={'300px'}
                isOpen={isOpen}
                onClose={onClose}
                body={
                    <Sidebar 
                        isOpen={isOpen}
                        onClose={onClose}
                        setFilter={setFilter}
                    />
                }
            />

            <Drawer 
                placement={'top'}
                isOpen={isOpenFilter}
                onClose={onCloseFilter}
                header="Filter: "
                body={
                    <Stack w='100%'>
                        <SimpleGrid columns={[1,2,4]} spacing={4} py={4}>
                            <Input border={'1px solid gray'} type="number" placeholder={"Search Min. Price"} onChange={ (e) => setSearch((prev: any) => ({...prev, minPrice: e.target.value })) }/>
                            <Input border={'1px solid gray'} type="number" placeholder={"Search Max. Price"} onChange={ (e) => setSearch((prev: any) => ({...prev, maxPrice: e.target.value })) }/>
                            <Select border={'1px solid gray'} placeholder="Sort By" onChange={ (e) => setSearch((prev: any) => ({...prev, sortBy: e.target.value })) }>
                                {["recent", "name", "most_used", "price"].map((status:any, i) => ( <option key={i} value={status}>{status == 'most_used' ? 'Most Used' : capCase(status)} </option> ))}
                            </Select>
                            <Select border={'1px solid gray'} placeholder="Order" onChange={ (e) => setSearch((prev: any) => ({...prev, order: e.target.value })) }>
                                {["asc", "desc", "shuffle"].map((status:any, i) => ( <option key={i} value={status}>{status == 'asc' ? "Ascending" : status == 'desc' ? "Descending" : capCase(status)} </option> ))}
                            </Select>
                        </SimpleGrid>
                    </Stack>

                }
                footer={
                    <HStack w={'100%'} justify={'flex-end'} spacing={2}>
                        <Button leftIcon={<MdLockReset />} onClick={ () => { onCloseFilter();} } />
                        <Button leftIcon={<BsSearch />} color={'white'} bgColor={'blackAlpha.800'} onClick={onFilter} />
                    </HStack>
                }
            />

        </Stack>
    );
};

export default TopNav;