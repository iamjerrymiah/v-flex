import { HStack, Box, Input, Tooltip, Stack } from '@chakra-ui/react';
import { useCategoryContext } from '../../../providers/CategoryContext';
import { useState } from 'react';
import { TbWorldSearch } from 'react-icons/tb';
import { capCase } from '../../../utils/utils';
import { IoReloadCircle } from "react-icons/io5";

interface TopNavProps {
  categories: any[];
  admin?: boolean;
  filter?: any;
  setFilter?: any;
}

const TopNav: React.FC<TopNavProps> = ({ categories, admin, setFilter }) => {

    const { topCategory, setTopCategory, setSubCategory, setLinkCategory } = useCategoryContext();

    const handleTopClick = (cat: any) => {
        setTopCategory(cat);
        setSubCategory(null);
        setLinkCategory(null)
    };

    const [search, setSearch] = useState<any>({});

    const resetFilter = () => {
        setFilter((prev:any) => ({ ...prev, categoryId: null }))
        setTopCategory(null);
        setSubCategory(null);
        setLinkCategory(null)
    }

    console.log(search)

    return (
        <Stack pt={4} pb={2} justify={'space-between'} spacing={4} direction={['column', 'row']}>
            <HStack>
                <IoReloadCircle size={30} cursor={'pointer'} onClick={() => resetFilter()}/>
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

            {!admin ? 
                <HStack spacing={4}>
                    <Tooltip label={'Search'}>
                        <TbWorldSearch 
                            size={30} 
                            cursor={'pointer'}
                            // onClick={openSearch}
                            color="#00008B"
                        />
                    </Tooltip> 

                    <Input border={'1px solid gray'} placeholder={"Search Product"} onChange={ (e) => setSearch((prev: any) => ({...prev, search: e.target.value })) }/>
                </HStack> : null
            }

        </Stack>
    );
};

export default TopNav;