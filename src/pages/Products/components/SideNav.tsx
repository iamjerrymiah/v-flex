import { Box, VStack, Text, Flex } from '@chakra-ui/react';
import { useCategoryContext } from '../../../providers/CategoryContext';
import { capCase } from '../../../utils/utils';

const renderSubcategories = (subcategories?: any[], level = 0) => {
	const { setLinkCategory } = useCategoryContext();

	if (!subcategories || subcategories.length === 0) return null;

	const handleLinkClick = (link:any) => {
		setLinkCategory(link)
	}

	return (
		<VStack align="start" pl={level * 4} spacing={1}>
			{subcategories.map((sub) => (
				<Box key={sub._id}>
					<Text 
						fontWeight={level == 0 ? "medium" : 'normal'} 
						onClick={() => handleLinkClick(sub)}
						cursor={'pointer'}
						_hover={{ color: 'gray' }}
					>
						{capCase(sub.name)}
					</Text>
					{renderSubcategories(sub.subcategories, level + 1)}
				</Box>
			))}
		</VStack>
	);
};

const SideNav = ({isOpen}: any) => {
	const { subCategory } = useCategoryContext();

	if (!subCategory) return null;

	return (
		<Flex>
			
			<Box
				h="100vh"
				w={isOpen ? '250px' : '0px'}
				overflowY={'scroll'}
				overflowX={'scroll'}
				className='scroll-custom'
				transition="all 0.3s ease"
				p={isOpen ? 4 : 0}
				display={subCategory.subcategories?.length > 0  ? 'block' : 'none'}
			>
				{isOpen && (
					<>
						<Text fontSize="2xl" fontWeight="bold" mb={4}>{capCase(subCategory.name)}</Text>
						{renderSubcategories(subCategory.subcategories)}
					</>
				)}
			</Box>

		</Flex>
	);
};

export default SideNav;