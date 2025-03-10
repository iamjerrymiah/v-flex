import { createStandaloneToast } from '@chakra-ui/react'
const { toast } = createStandaloneToast()
const position = 'top-right'

const Notify = {
    success(msg: string, title?: string) {
        return toast({
            title: title,
            description: msg,
            status: 'success',
            duration: 4000,
            isClosable: true,
            position: position,
        })
    },

    error(msg: string, title?: string) {
        return toast({
            title: title,
            description: msg,
            status: 'error',
            duration: 4000,
            isClosable: true,
            position: position,
        })
    },

    warning(msg: string, title?: string) {
        return toast({
            title: title,
            description: msg,
            status: 'warning',
            duration: 4000,
            isClosable: true,
            position: position,
        })
    },

    info(msg: string, title?: string) {
        return toast({
            title: title,
            description: msg,
            status: 'info',
            duration: 4000,
            isClosable: true,
            position: position,
        })
    },
}

export default Notify