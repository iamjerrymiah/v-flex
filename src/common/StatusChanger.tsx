import { Box, Flex, HStack, Tag, Text } from '@chakra-ui/react'
import { statuses } from '../constants/constants'
import { allLower, capCase } from '../utils/utils'

export default function StatusChanger({ datum }: { datum: any }) {
    return (
        <Box>
            {statuses.positive.includes(allLower(datum)) ? (
                <Tag colorScheme='whatsapp' size='sm' color={'#027A48'}>
                    <Flex gap={1}><Text>{capCase(datum)}</Text> </Flex>
                </Tag>
            ) : statuses.pending.includes(allLower(datum)) ? (
                <Tag colorScheme='blackAlpha' size='sm'>
                    <Flex gap={1}><Text>{capCase(datum)}</Text> </Flex>
                </Tag>
            ) : statuses.negative.includes(allLower(datum)) ? (
                <Tag colorScheme='red' size='sm' color={'#F15046'}>
                    <Flex gap={1}><Text>{capCase(datum)}</Text> </Flex>
                </Tag>
            ) : statuses.other.includes(allLower(datum)) ? (
                <Tag colorScheme='purple' size='sm'>
                    <Flex gap={1}> <Text>{capCase(datum)}</Text> </Flex>
                </Tag>
            ) : (
                <HStack w='max-content'>
                    <Box fontSize={'13px'} fontWeight={500}>{datum}</Box>
                </HStack>
            )}
        </Box>
    )
}
