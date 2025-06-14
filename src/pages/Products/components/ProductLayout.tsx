import {
  Box,
  Flex,
  HStack,
  Button,
  useBreakpointValue
} from '@chakra-ui/react';
import TopNav from './TopNav';
import SubNav from './SubNav';
import Breadcrumbs from './Breadcrumbs';
import SideNav from './SideNav';
import React from 'react';
import { useCategoryContext } from '../../../providers/CategoryContext';
import { MotionAnimator } from '../../../common/MotionAnimator';
import { PiSlideshowFill, PiEyeClosedFill } from "react-icons/pi";


export default function ProductLayout ({ 
	children, 
	categories,
	isOpen,
	setIsOpen,
	filter,
	setFilter,
	search,
	setSearch, 
}:{children:React.ReactNode, categories:any[], isOpen:boolean, setIsOpen:any, search?:any, filter?:any, setFilter?:any, setSearch?:any}) {
  
	const { subCategory } = useCategoryContext();
    const isMobile = useBreakpointValue({ base: true, md: false });

  	return (
		<Box>
			<TopNav 
				filter={filter}
				search={search}
				setSearch={setSearch}
				categories={categories} 
				setFilter={setFilter} 
			/>
			{!isMobile && <SubNav /> }
			{subCategory && !isMobile &&
				<HStack justify={'space-between'}>
					<Breadcrumbs />
					<Button
						leftIcon={isOpen ? <PiEyeClosedFill size={20}/>  : <PiSlideshowFill size={20}/>}
						onClick={() => setIsOpen(!isOpen)}
						color={'black'}
						variant={'outline'}
						display={subCategory.subcategories?.length > 0 ? 'block' : 'none'}
					>
						{/* {isOpen ? 'Hide' : 'Show'} */}
					</Button>
				</HStack>
			}

			<Flex>
				{!isMobile && <SideNav isOpen={isOpen} setIsOpen={setIsOpen}/> }

				{/* Main Content */}
				<Box 
					flex="1" 
					p={[0, 4]} 
					transition="margin-left 0.3s ease"
				>
					<MotionAnimator direction='right' delay={0.4}>
						{children}
					</MotionAnimator>
				</Box>

			</Flex>
		</Box>
	);
};