import {
  Box,
  Flex,
  HStack,
  Button,
} from '@chakra-ui/react';
import TopNav from './TopNav';
import SubNav from './SubNav';
import Breadcrumbs from './Breadcrumbs';
import SideNav from './SideNav';
import React, { useState } from 'react';
// import { TiChevronRightOutline, TiChevronLeftOutline } from "react-icons/ti";
import { useCategoryContext } from '../../../providers/CategoryContext';


export default function ProductLayout ({ children, categories }:{children: React.ReactNode, categories: any[]}) {
  
	const { subCategory } = useCategoryContext();
  
  	const [isOpen, setIsOpen] = useState(true);

  return (
    <Box>
		<TopNav categories={categories} />
		<SubNav />
		{subCategory &&
			<HStack justify={'space-between'}>
				<Breadcrumbs />
				<Button
					// rightIcon={isOpen ? <TiChevronLeftOutline /> : <TiChevronRightOutline/>}
					onClick={() => setIsOpen(!isOpen)}
					transition="left 0.3s ease"
					color={'white'}
					bgColor={'blackAlpha.700'}
					size={'md'}
					textAlign={'center'}
					display={subCategory.subcategories?.length > 0 ? 'block' : 'none'}
				>
					{isOpen ? 'Hide' : 'Show'} Category
				</Button>
			</HStack>
		}

		<Flex>
			<SideNav isOpen={isOpen} setIsOpen={setIsOpen}/> 

			{/* Main Content */}
			<Box flex="1" p={6} transition="margin-left 0.3s ease">
				{children}
			</Box>

		</Flex>
    </Box>
  );
};