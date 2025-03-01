
import { useState } from "react";
import { Box, Text, VStack, Button, HStack } from "@chakra-ui/react";
import { MdOutlineChevronRight, MdOutlineArrowBackIos } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";


export default function Sidebar({}: { isOpen: boolean; onClose: ()=>void }) {

    const [history, setHistory] = useState([{ categories, currentCategory: null }]); // Track navigation history

    const openCategory = (category:any) => {
      if (category.subcategories.length > 0) {
        setHistory((prev) => [...prev, { categories: category.subcategories, currentCategory: category }]);
      }
    };
  
    const goBack = () => {
      if (history.length > 1) {
        setHistory((prev) => prev.slice(0, -1));
      }
    };

    return (
        <Box px={[2, 4, 4, 10]} mt={6} overflowY={'scroll'}>
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
                            <Link to={history[history.length - 1]?.currentCategory?.link}>
                                <Box mb={4} fontSize={['28px', '30px']} textDecor={'underline'}>
                                    {history[history?.length - 1]?.currentCategory?.name}
                                </Box>
                            </Link>
                        )}

                        {/* Render category items */}
                        {history[history?.length - 1].categories.map((category) => (
                            <HStack
                                key={category.name}
                                justifyContent="space-between"
                                pr={[8,10,10, 20]}
                                w="full"
                                cursor="pointer"
                                onClick={() => openCategory(category)}
                            >
                                {/* If no subcategories, it's a link */}
                                {category?.subcategories?.length === 0 ? (
                                    <Link to={category?.link} >
                                        <Box textDecor={'underline'} fontWeight={400} fontSize={['14px', '18px']}>{category.name}</Box>
                                    </Link>
                                    ) : (
                                        <Text fontWeight={600} fontSize={['16px', '20px']}>{category?.name}</Text>
                                    )
                                }
                                {category?.subcategories?.length > 0 && <Box><MdOutlineChevronRight size={30}/></Box>}
                            </HStack>
                        ))}
                    </VStack>

                </motion.div>
            </AnimatePresence>
      </Box>
    )
}


const categories = [
    {
		name: "Men",
		link: "/men",
		subcategories: [
			{
				name: "Clothing",
				link: "/men/clothing",
				subcategories: [
					{ name: "T-Shirts", link: "/men/clothing/t-shirts", subcategories: [] },
					{ name: "Leather", link: "/men/clothing/leather", subcategories: [] },
					{ name: "Outwears & Coats", link: "/men/clothing/outwears", subcategories: [] },
					{ name: "Poloshirt", link: "/men/clothing/poloshirts", subcategories: [] },
					{ name: "Denim", link: "/men/clothing/denim", subcategories: [] },
					{ name: "Knitwear", link: "/men/clothing/knitwear", subcategories: [] },
					{ name: "Jogging", link: "/men/clothing/jogging", subcategories: [] },
					// { name: "Sweatshirts & Hoodies", link: "/men/clothing/sweatshirts", subcategories: [] },
					// { name: "Shirts", link: "/men/clothing/shirts", subcategories: [] },
					// { name: "Sartorial", link: "/men/clothing/sartorial", subcategories: [] },
					// { name: "Trousers & Shorts", link: "/men/clothing/trousers", subcategories: [] },
					// { name: "Beachwear", link: "/men/clothing/beachwear", subcategories: [] },
					// { name: "Underwear", link: "/men/clothing/underwear", subcategories: [] },
				],			
			},
			{
				name: "Shoes",
				link: "/men/shoes",
				subcategories: [
					{ name: "Sneakers", link: "/men/shoes/sneakers", subcategories: [] },
					{ name: "Formal", link: "/men/shoes/formal", subcategories: [] },
				],
			},
			{
				name: "Bags",
				link: "/men/bags",
				subcategories: [
					{ name: "Sneakers", link: "/men/shoes/sneakers", subcategories: [] },
					{ name: "Formal", link: "/men/shoes/formal", subcategories: [] },
				],
			},
			{
				name: "Accessories",
				link: "/men/accessories",
				subcategories: [
					{ name: "Sneakers", link: "/men/shoes/sneakers", subcategories: [] },
					{ name: "Formal", link: "/men/shoes/formal", subcategories: [] },
				],
			},
			{
				name: "Fashion Jewelery",
				link: "/men/jewelery",
				subcategories: [
					{ name: "Sneakers", link: "/men/shoes/sneakers", subcategories: [] },
					{ name: "Formal", link: "/men/shoes/formal", subcategories: [] },
				],
			},
			{
				name: "Watches",
				link: "/men/watches",
				subcategories: []
			},
		],
    },
    {
      name: "Women",
      link: "/women",
      subcategories: [
        { name: "Dresses", link: "/women/dresses", subcategories: [] },
        {
          name: "Handbags",
          link: "/women/handbags",
          subcategories: [
            { name: "Totes", link: "/women/handbags/totes", subcategories: [] },
            { name: "Clutches", link: "/women/handbags/clutches", subcategories: [] },
          ],
        },
      ],
    },
    {
      name: "Kids",
      link: "/kids",
      subcategories: [
        { name: "Dresses", link: "/women/dresses", subcategories: [] },
        {
          name: "Handbags",
          link: "/women/handbags",
          subcategories: [
            { name: "Totes", link: "/women/handbags/totes", subcategories: [] },
            { name: "Clutches", link: "/women/handbags/clutches", subcategories: [] },
          ],
        },
      ],
    },
    {
      name: "Sneakers",
      link: "/sneakers",
      subcategories: [
        { name: "Dresses", link: "/women/dresses", subcategories: [] },
        {
          name: "Handbags",
          link: "/women/handbags",
          subcategories: [
            { name: "Totes", link: "/women/handbags/totes", subcategories: [] },
            { name: "Clutches", link: "/women/handbags/clutches", subcategories: [] },
          ],
        },
      ],
    },
    {
      name: "Watches",
      link: "/watches",
      subcategories: [
        { name: "Dresses", link: "/women/dresses", subcategories: [] },
        {
          name: "Handbags",
          link: "/women/handbags",
          subcategories: [
            { name: "Totes", link: "/women/handbags/totes", subcategories: [] },
            { name: "Clutches", link: "/women/handbags/clutches", subcategories: [] },
          ],
        },
      ],
    },
    {
      name: "Jewelry",
      link: "/jewelry",
      subcategories: [
        { name: "Dresses", link: "/women/dresses", subcategories: [] },
        {
          name: "Handbags",
          link: "/women/handbags",
          subcategories: [
            { name: "Totes", link: "/women/handbags/totes", subcategories: [] },
            { name: "Clutches", link: "/women/handbags/clutches", subcategories: [] },
          ],
        },
      ],
    },
    {
      name: "Fragrances",
      link: "/fragrances",
      subcategories: [
        { name: "Dresses", link: "/women/dresses", subcategories: [] },
        {
          name: "Handbags",
          link: "/women/handbags",
          subcategories: [
            { name: "Totes", link: "/women/handbags/totes", subcategories: [] },
            { name: "Clutches", link: "/women/handbags/clutches", subcategories: [] },
          ],
        },
      ],
    },
	{
		name: "Eyewear",
		link: "/eyewear",
		subcategories: [
		  { name: "Dresses", link: "/women/dresses", subcategories: [] },
		  {
			name: "Handbags",
			link: "/women/handbags",
			subcategories: [
			  { name: "Totes", link: "/women/handbags/totes", subcategories: [] },
			  { name: "Clutches", link: "/women/handbags/clutches", subcategories: [] },
			],
		  },
		],
	},
	{
		name: "Gifts",
		link: "/gifts",
		subcategories: [
		  { name: "Dresses", link: "/women/dresses", subcategories: [] },
		  {
			name: "Handbags",
			link: "/women/handbags",
			subcategories: [
			  { name: "Totes", link: "/women/handbags/totes", subcategories: [] },
			  { name: "Clutches", link: "/women/handbags/clutches", subcategories: [] },
			],
		  },
		],
	},
	{
		name: "Hospitality",
		link: "/hospitality",
		subcategories: [
		  { name: "Dresses", link: "/women/dresses", subcategories: [] },
		  {
			name: "Handbags",
			link: "/women/handbags",
			subcategories: [
			  { name: "Totes", link: "/women/handbags/totes", subcategories: [] },
			  { name: "Clutches", link: "/women/handbags/clutches", subcategories: [] },
			],
		  },
		],
	  },
  ];
