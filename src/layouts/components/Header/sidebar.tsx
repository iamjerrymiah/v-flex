
import { useState } from "react";
import { Box, Text, VStack, Button, HStack } from "@chakra-ui/react";
import { MdOutlineChevronRight, MdOutlineArrowBackIos } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useGetProductCollections } from "../../../hooks/products/collections";
import { capCase } from "../../../utils/utils";


export default function Sidebar({ onClose }: { isOpen: boolean; onClose: ()=>void }) {

  const navigate = useNavigate()

  const { data: collectionData = {} } = useGetProductCollections({})
  const { data: categories = [] } = collectionData

  const [history, setHistory] = useState<any>([{ categories, currentCategory: null }]); // Track navigation history

  const openCategory = (category:any) => {
    if (category.subcategories.length > 0) {
      setHistory((prev:any) => [...prev, { categories: category.subcategories, currentCategory: category }]);
    }
  };

  const goBack = () => {
    if (history.length > 1) {
      setHistory((prev:any) => prev.slice(0, -1));
    }
  };

    return (
        <Box px={[2, 4, 4, 10]} mt={6}>
            {history.length > 1 && (
                <Button
                    leftIcon={<MdOutlineArrowBackIos />}
                    variant="ghost"
                    onClick={goBack}
                    mt={4}
                    mb={4}
                    textDecor={'underline'}
                >
                    Back
                </Button>
            )}
            <AnimatePresence mode="wait">
                <motion.div
                    key={history.length}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ position: "absolute", width: "100%" }}
                >
                    <VStack align="start" spacing={4} mt={4} px={6}>

                        {history[history?.length - 1]?.currentCategory && (
                            <Box cursor={'pointer'} onClick={() => { navigate(`/products/vl/${history[history.length - 1]?.currentCategory?.slug ?? ""}?componentsVfcategory=${history[history.length - 1]?.currentCategory?._id}`); onClose() }}>
                                <Box mb={4} fontSize={['28px', '30px']} textDecor={'underline'}>
                                    {capCase(history[history?.length - 1]?.currentCategory?.name ?? "")}
                                </Box>
                            </Box>
                        )}

                        {history[history.length - 1]?.categories.map((category: any) => {
                          // Build full path from history
                          const fullCategoryPath = history
                            .slice(1) // Skip the root categories
                            .map((entry: any) => entry.currentCategory?.slug)
                            .filter(Boolean) // Remove nulls
                            .concat(category.slug) // Append current category
                            .join("/");

                          return (
                            <VStack key={category._id} w="full" alignItems="stretch">
                              <HStack
                                justifyContent="space-between"
                                pr={[8, 10, 10, 20]}
                                w="full"
                                cursor="pointer"
                                onClick={() => openCategory(category)}
                              >
                                {/* If category has no subcategories, it's a link */}
                                {category?.subcategories?.length === 0 || !category?.subcategories ? (
                                  <Box cursor={'pointer'} onClick={() => { navigate(`/products/vl/${fullCategoryPath}?componentsVfcategory=${category._id}`); onClose(); } } >
                                    <Box textDecor="underline" fontWeight={400} fontSize={['14px', '18px']}>
                                      {capCase(category.name ?? "")}
                                    </Box>
                                  </Box>
                                ) : (
                                  <Text fontWeight={600} fontSize={['16px', '20px']}>
                                    {capCase(category?.name ?? "")}
                                  </Text>
                                )}

                                {/* Show right arrow if subcategories exist */}
                                {category?.subcategories?.length > 0 && <MdOutlineChevronRight size={30} />}
                              </HStack>
                            </VStack>
                          );
                        })}
                    </VStack>

                </motion.div>
            </AnimatePresence>
      </Box>
    )
}
