import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react'


function ModalCenter({
    isOpen,
    onClose,
    size,
    width,
    height,
    header,
    body,
    footer,
    noClose,
    headerColor,
    dark
}: any) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            scrollBehavior='outside'
            size={size}
            isCentered
        >
            <ModalOverlay backdropFilter='blur(8px)' />
            {isOpen ? 
                <ModalContent h={height} minW={width} bgColor={dark ? 'blackAlpha.300' : ''}>
                    <ModalHeader color={headerColor}>{header}</ModalHeader>
                    {!noClose && <ModalCloseButton color={dark ? 'white' : ''}/>}
                    <ModalBody overflow='auto'>{body}</ModalBody>
                    <ModalFooter>{footer}</ModalFooter>
                </ModalContent>
            : null}
        </Modal>
    )
}

export default ModalCenter