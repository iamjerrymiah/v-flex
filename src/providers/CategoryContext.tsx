import React, { createContext, useState, useContext } from 'react';

interface CategoryContextType {
  topCategory: any;
  setTopCategory: any;
  subCategory: any;
  setSubCategory: any;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [topCategory, setTopCategory] = useState<any>(null);
  const [subCategory, setSubCategory] = useState<any>(null);

  return (
    <CategoryContext.Provider value={{ topCategory, setTopCategory, subCategory, setSubCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategoryContext must be used within a CategoryProvider");
  }
  return context;
};