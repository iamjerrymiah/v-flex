import { Box, Card, CardBody, Heading, Stack, Text } from "@chakra-ui/react";

const userCardList = [
    {
        note:"I was hesitant to order online, but this store exceeded my expectations! The sneakers I bought were exactly as described—comfortable, stylish, and high-quality. The shipping was surprisingly fast, and the packaging felt premium. What really impressed me was the customer support; they responded quickly when I had a question about sizing. I’ve already received so many compliments, and I’ll definitely be coming back for more. Highly recommended!",
        name:'Jane Doe',
    },
    {
        note:"I can’t say enough good things about my experience! I’ve purchased sneakers from various online stores, but none compare to this one. The selection is top-notch, with all the latest designs and styles. The website was easy to navigate, checkout was seamless, and my order arrived on time. The best part? The comfort and durability of the sneakers—I’ve been wearing mine daily, and they still look brand new. If you’re looking for quality and reliability, this is the place!",
        name:'John Smith',
    },
    {
        note:"I was searching for a pair of sneakers that would stand out, and I found exactly what I was looking for here. The craftsmanship is incredible, and the sneakers feel luxurious yet comfortable. I love that this store carries trendy, unique designs that I don’t see everywhere else. The entire experience, from browsing to unboxing, felt like a premium shopping experience. I’m beyond happy with my purchase and can’t wait to shop here again!",
        name:'Emily Rose',
    }
]

const TestimonialCard = ({ name, note }:any) => {
    return (
        <Card
            borderRadius='18px'
            p='5px'
            minW={['full', 'full', '400px', '400px']}
            w='450px'
            boxShadow={`0px 0px 30px 0px gray`}
        >
            <CardBody>
                <Stack justifyContent='space-between' h='full' alignItems='center' pt={3} px={3}>
                    <Text 
                        fontSize='14px' 
                        textAlign='center'
                    >
                        "{note}"
                    </Text>
                    
                    <Stack alignItems='center'>
                        <Heading size='16' color='#082932'>- {name}</Heading>
                    </Stack>
                </Stack>
            </CardBody>
        </Card>
    )
}


export default function TestimonialSection() {
    return (
        <Box 
            px={['20px', '20px', '30px', '50px']} 
            textAlign="center"
        >

            <Heading fontSize={['3xl', '3xl', '3xl', "4xl"]}>What Our Customers Say</Heading>

                <Stack
                    direction={['row', 'row', 'row']}
                    w='full'
                    justify='space-between'
                    spacing={5}
                    px={5} 
                    py={10}
                    overflowX='scroll'
                    css={{
                        scrollbarWidth: "none", // Hide scrollbar for Firefox
                        "-ms-overflow-style": "none", // Hide scrollbar for IE/Edge
                        "&::-webkit-scrollbar": {
                        display: "none", // Hide scrollbar for Chrome/Safari
                        },
                    }}
                >
                    {userCardList.map((list, index) => (
                        <TestimonialCard 
                            key={index}
                            note={list.note}
                            name={list.name}
                        />
                    ))}
                </Stack>
      </Box>
    )
}
