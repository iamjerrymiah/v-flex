import { HStack, Box, Input, Tooltip, Stack } from '@chakra-ui/react';
import { useCategoryContext } from '../../../providers/CategoryContext';
import { useState } from 'react';
import { TbWorldSearch } from 'react-icons/tb';
import { capCase } from '../../../utils/utils';

interface TopNavProps {
  categories: any[];
  admin?: boolean
}

const TopNav: React.FC<TopNavProps> = ({ categories, admin }) => {

    const { topCategory, setTopCategory, setSubCategory } = useCategoryContext();

    const handleTopClick = (cat: any) => {
        setTopCategory(cat);
        setSubCategory(null);
    };

    const [search, setSearch] = useState<any>({});
    console.log(search)

    return (
        <Stack pt={4} pb={2} justify={'space-between'} spacing={4} direction={['column', 'row']}>
            <HStack>
                {/* <Text fontSize={['14px', '18px']} >Categories: </Text> */}
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
                        {capCase(cat.name)}
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