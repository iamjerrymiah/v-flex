import { Drawer as ChakraDrawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton } from '@chakra-ui/react'

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    body: React.ReactNode;
    headerColor?: string;
    size?: string;
    header?: string;
    footer?: React.ReactNode;
    placement?: any;
}

function Drawer({
    isOpen,
    onClose,
    header,
    body,
    footer,
    headerColor,
    size,
    placement,
    ...props
}: DrawerProps) {
    return (isOpen ?
        <ChakraDrawer
            isOpen={isOpen}
            placement={placement ?? 'right'}
            onClose={onClose}
            size={size}
            {...props}
        >
            <DrawerOverlay/>
            <DrawerContent maxW={!size ? '500px' : size}>
                <DrawerCloseButton fontSize='md'/>
                <DrawerHeader color={headerColor}>{header}</DrawerHeader>
                <DrawerBody  overflowY="auto">
                    {body}
                </DrawerBody>
                {footer && <DrawerFooter justifyContent='center'>{footer}</DrawerFooter>}
            </DrawerContent>
        </ChakraDrawer>
    : null)
}

export default Drawer