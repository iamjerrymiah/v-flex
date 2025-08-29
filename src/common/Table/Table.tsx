import { TableContainer, Table as ChakraTable, Tbody, Td, Th, Thead, Tr, HStack, Tag, Box, Text, Skeleton } from '@chakra-ui/react'
import { MdSort } from 'react-icons/md'
import EmptyListHero from '../EmptyListHero'
import { allLower } from '../../utils/utils'
import MenuDropdown from '../MenuDropdown'
import { MouseEventHandler } from 'react'

export function Table({ title, headings = [], headerBg, headerColor, noIndexPad, onClickHeading, children, isEmpty, emptyText, loading, mt, ...props }: any) {

    return (loading ? (
        <Box mt={mt}>
            <Box w='full' borderRadius='md' py={2}>
                <Skeleton borderRadius='md' h='50px' mb={2} />
                <Skeleton borderRadius='md' h='50px' mb={2}/>
                <Skeleton borderRadius='md' h='50px' mb={2}/>
            </Box>
        </Box>
    ) : (
        <Box w='full' mt={mt}>
            {title && <Text fontWeight={500} fontSize={['18px']}>{title}</Text>}
            
            <TableContainer w='full' className='scroll-custom' borderRadius='lg' {...props}>
                <ChakraTable variant='simple' fontSize={['12px', '14px']}>
                    <Thead bgColor={headerBg ?? "gray.700"}>
                        <Tr>
                            {headings.map((heading:any, index:any, arr:any) => heading.name === '' ? <Th key={index}></Th> :
                                <Th
                                    key={index}
                                    borderTopLeftRadius={index === 0 ? 'lg' : ''}
                                    borderTopRightRadius={index === (arr.length - 1) ? 'lg' : ''}
                                    textTransform='none'
                                    paddingLeft={(index === 0 && !noIndexPad) ? 0 : ''}
                                    fontSize={['14px', '14px', '14px']}
                                    py={4}
                                >
                                    <HStack align='center'>
                                        <Text color={headerColor ?? '#fff'} fontWeight={500}>
                                            {heading.name ?? heading}
                                        </Text>
                                        {onClickHeading && 
                                            <MdSort
                                                size={18}
                                                color={headerColor ?? '#fff'}
                                                onClick={() => onClickHeading(heading['key'])}
                                                cursor={onClickHeading ? 'pointer' : 'default'}
                                            />
                                        }
                                    </HStack>
                                </Th>
                            )}
                        </Tr>
                    </Thead>
                    {children && !isEmpty &&
                        <Tbody>{children}</Tbody>
                    }
                </ChakraTable>
                {isEmpty &&
                    <EmptyListHero text={emptyText} />     
                }
            </TableContainer>
        </Box>
    ))
}


export function TableRow({ data = [], onClickRow, rowData, options, noIndexPad }:any) {

    const stopPropagation: MouseEventHandler<HTMLButtonElement | HTMLDivElement> = (e:any) => {
        e.stopPropagation()
    }

    return (
        <Tr onClick={e => { onClickRow ? onClickRow(rowData) : stopPropagation(e); }}>
            {data.map((datum:any, index:any) => (
                <Td key={index} paddingLeft={(index === 0 && !noIndexPad) ? 0 : ''}>
                    {allLower(datum) === 'yes' || allLower(datum) === 'activated' || allLower(datum) === 'successful' || allLower(datum) === 'enabled' ? (
                        <Tag colorScheme='whatsapp' size='sm'>{datum}</Tag>
                    ) : allLower(datum) === 'no' || allLower(datum) === 'deactivated' || allLower(datum) === 'failed' || allLower(datum) === 'disabled' ? (
                        <Tag colorScheme='red' size='sm'>{datum}</Tag>
                    ): allLower(datum) === 'pending' ? (
                        <Tag colorScheme='gray' size='sm'>{datum}</Tag>
                    ) : (
                        <Box fontSize={['14px']}>{datum}</Box>
                    )}
                </Td>
            ))}
            {options &&
                <Td>
                    <MenuDropdown options={options} rowData={rowData}/>
                </Td>
            }
        </Tr>

    )
}