import { Flex, Center, Text, Image, Button } from '@chakra-ui/react'
import emptyListImg from '../assets/icons/emptyList.png'
import { useNavigate } from 'react-router';

interface EmptyListHeroProps {
    text: string;
    w?: string;
    h?: string;
    link?: string;
    linkName?: string;
}

function EmptyListHero({ text, w, h, link, linkName }: EmptyListHeroProps) {
    const navigate = useNavigate()
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
            {link &&
                <Center>
                    <Button mt={2} bgColor={'gray'} color={'white'} onClick={() => navigate(link)}>
                        {linkName}
                    </Button>
                </Center>
            }
        </Flex>
    )
}

export default EmptyListHero