import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Box } from '@chakra-ui/react';
import { useCategoryContext } from '../../../providers/CategoryContext';
import { capCase } from '../../../utils/utils';

const Breadcrumbs = () => {
  const { topCategory, subCategory } = useCategoryContext();

  return (
    <Box p={4}>
      <Breadcrumb>
        {/* <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem> */}
        {topCategory && (
          <BreadcrumbItem>
            <BreadcrumbLink>{capCase(topCategory.name)}</BreadcrumbLink>
          </BreadcrumbItem>
        )}
        {subCategory && (
          <BreadcrumbItem>
            <BreadcrumbLink>{capCase(subCategory.name)}</BreadcrumbLink>
          </BreadcrumbItem>
        )}
      </Breadcrumb>
    </Box>
  );
};

export default Breadcrumbs;