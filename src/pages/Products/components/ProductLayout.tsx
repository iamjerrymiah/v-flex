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
import React from 'react';
// import { TiChevronRightOutline, TiChevronLeftOutline } from "react-icons/ti";
import { useCategoryContext } from '../../../providers/CategoryContext';
import { MotionAnimator } from '../../../common/MotionAnimator';


export default function ProductLayout ({ 
	children, 
	categories,
	isOpen,
	setIsOpen,
	filter,
	setFilter 
}:{children: React.ReactNode, categories: any[], isOpen:boolean, setIsOpen:any, filter?:any, setFilter?:any}) {
  
	const { subCategory } = useCategoryContext();

  	return (
		<Box>
			<TopNav 
				filter={filter}
				categories={categories} 
				setFilter={setFilter} 
			/>
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
					<MotionAnimator direction='right' delay={0.4}>
						{children}
					</MotionAnimator>
				</Box>

			</Flex>
		</Box>
	);
};