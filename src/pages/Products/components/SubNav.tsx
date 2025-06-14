import {
  Box,
  HStack,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  SimpleGrid,
} from '@chakra-ui/react';
import { useCategoryContext } from '../../../providers/CategoryContext';
import { capCase } from '../../../utils/utils';

const SubNav: React.FC = () => {
	const { topCategory, setSubCategory, setLinkCategory } = useCategoryContext();

	if (!topCategory) return null;
	const handleSubClick = (sub:any) => {
		setSubCategory(sub)
		setLinkCategory(null)
	}

	const handleLinkClick = (link:any) => {
		setLinkCategory(link)
		// setSubCategory(null)
	}

	return (
		<Box w='100%' mb={6} borderBottom={'1px solid #ccc'}>
			<HStack overflowX={'scroll'} className='scroll-custom'>
				{topCategory.subcategories?.map((sub:any) => (
					<Popover trigger="hover" placement='bottom-start' key={sub._id}>
						<PopoverTrigger>
							<Button 
								variant="ghost" 
								onClick={() => handleSubClick(sub)}
							>
								{capCase(sub.name)}
							</Button>
						</PopoverTrigger>
						{sub.subcategories && (
							<PopoverContent
								width={['100%', "98vw"]}
								height={['100px', '300px']}
								boxShadow="lg"
								bg="white"
							>
								<PopoverBody w='100%'>
									<SimpleGrid 
										columns={5} 
										w='100%' 
										spacing={6}
										py={6}
										px={['10%', '10%', '10%', '20%']}
									>
										{sub.subcategories.map((child:any, index:any) => (
											<Box 
												key={index} 
												py={1}
												fontWeight={500}
												cursor={'pointer'}
												textAlign={'center'}
												justifyContent={'center'}
												alignItems={'center'}
												_hover={{ color: 'gray' }}
												onClick={() => handleLinkClick(child)}
											>
												{capCase(child.name)}
											</Box>
										))}
									</SimpleGrid>
								</PopoverBody>
							</PopoverContent>
							)}
					</Popover>
				))}
			</HStack>
		</Box>
	);
};

export default SubNav;