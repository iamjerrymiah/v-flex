import { Flex, Center, Text, Image } from '@chakra-ui/react'
import emptyListImg from '../assets/icons/emptyList.png'

interface EmptyListHeroProps {
    text: string;
    w?: string;
    h?: string;
}

function EmptyListHero({ text, w, h }: EmptyListHeroProps) {
    return (
        <Flex bg='transparent' direction='column' py='50px' w='full'>
            <Center mb={3}>
                <Image
                    src={emptyListImg}
                    width={w ?? 190}
                    height={h ?? 190}
                    alt='empty list'
                />
            </Center>
            <Text fontSize='lg' fontWeight={500} px={6} color='#56505B' textAlign='center'>{text}</Text>
        </Flex>
    )
}

export default EmptyListHero