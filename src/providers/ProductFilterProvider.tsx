import { useDisclosure } from '@chakra-ui/react';
import React, { createContext, useContext } from 'react';

const ProductFilterContext = createContext<DrawerContextType | undefined>(undefined)

type DrawerContextType = {
  isOpenSearch: boolean;
  openSearch: () => void;
  closeSearch: () => void;
};

export const ProductFilterProvider = ({ children }: { children: React.ReactNode }) => {

    const { isOpen: isOpenSearch, onOpen: openSearch, onClose: closeSearch } = useDisclosure();

    return (
        <ProductFilterContext.Provider value={{ isOpenSearch, openSearch, closeSearch }}>
            {children}
        </ProductFilterContext.Provider>
    );
};

export const useProductFilter = (): DrawerContextType => {
  const context = useContext(ProductFilterContext);
  if (!context) {
    throw new Error('');
  }
  return context;
};