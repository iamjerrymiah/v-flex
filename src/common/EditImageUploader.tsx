import {
    Box,
    Image,
    IconButton,
    Input,
    VStack,
    Text,
    SimpleGrid,
    Spinner,
    Button
} from "@chakra-ui/react";
import { FiUpload, FiX, FiEdit } from "react-icons/fi";
import { useRef } from "react";
import Notify from "../utils/notify";

type ImageData = { file: File; preview: string };

type EditImageUploaderProps = {
    mainImage: any;
    imageUrlArray: any[];
    onMainImageChange?: any;
    onMainImageDelete?: () => void;
    onChange?: any;
    onDelete?: any;
    onSaveMainImage?: () => void;
    onSaveImageArray?: () => void;
    isLoading?: boolean;
    isLoadingDelete?: boolean;
    isLoadingImages?: boolean;
    setImageUrlArray?: any;
};

export default function EditImageUploader({
    mainImage,
    imageUrlArray,
    onMainImageChange,
    // onMainImageDelete,
    onChange,
    onDelete,
    onSaveMainImage,
    onSaveImageArray,
    isLoading,
    isLoadingDelete,
    isLoadingImages,
    setImageUrlArray
}: EditImageUploaderProps) {
    
    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const mainFileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (file: File, onUpload: (file: File) => void) => {
        const acceptedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!acceptedTypes.includes(file.type)) {
            Notify.error("Only JPG, PNG, and JPEG image files are allowed");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            Notify.error("File must be smaller than 2MB");
            return;
        }
        onUpload(file);
    };

    const renderImageBox = (
        image: ImageData,
        index: number,
        isMain = false
    ) => {
        
        return (
        <Box
            key={index}
            position="relative"
            width="100%"
            height="250px"
            border="2px solid"
            borderColor="gray.200"
            borderRadius="10px"
            overflow="hidden"
        >
            {(isLoading || isLoadingDelete || isLoadingImages) && (
                <Box
                    width="100%"
                    height="100%"
                    bg="rgba(255, 255, 255, 0.5)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    zIndex={9999}
                >
                    <Spinner size="xl" color="blue.500" thickness="4px" />
                </Box>
            )}

            <Image
                src={image.preview ?? image}
                alt={`Uploaded ${index}`}
                objectFit="contain"
                width="100%"
                height="100%"
            />

            {/* Delete */}
            {!isMain && (
                <IconButton
                    aria-label="Delete image"
                    icon={<FiX />}
                    size="sm"
                    colorScheme="red"
                    position="absolute"
                    top="5px"
                    right="5px"
                    // onClick={() => onDelete(index)}
                    onClick={() => {
                        if (image?.preview) {
                            // Just remove it locally — do not call the delete API
                            const updated = [...imageUrlArray];
                            updated.splice(index, 1);
                            setImageUrlArray(updated); // or use your parent handler
                        } else {
                            // Call the delete API
                            onDelete(index);
                        }
                    }}
                />
            )}

            {/* Change */}
            {isMain && (
                <IconButton
                    aria-label="Change image"
                    icon={<FiEdit />}
                    size="sm"
                    colorScheme="blue"
                    position="absolute"
                    top="5px"
                    left="5px"
                    onClick={() =>
                        isMain
                            ? mainFileInputRef.current?.click()
                            : fileInputRefs.current[index]?.click()
                    }
                />
            )}

            {/* Hidden Input */}
            <Input
                type="file"
                accept="image/*"
                display="none"
                ref={(el) => {
                    if (!isMain) fileInputRefs.current[index] = el;
                    else mainFileInputRef.current = el;
                }}
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    handleFileChange(file, (f) =>
                        isMain ? onMainImageChange(f) : onChange(index, f)
                    );
                }}
            />
        </Box>
    )};

    const renderAddBox = (index: number) => (
        <Box
            key={`add-${index}`}
            as="label"
            border="2px dashed gray"
            borderRadius="10px"
            height="150px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            cursor="pointer"
            _hover={{ borderColor: "blue.400" }}
        >
            <FiUpload size={24} color="gray" />
            <Text fontSize="xs" color="gray.500">
                Add Image
            </Text>
            <Input
                type="file"
                accept="image/*"
                display="none"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    handleFileChange(file, (f) =>
                        onChange(imageUrlArray.length, f)
                    );
                }}
            />
        </Box>
    );

    return (
        <VStack spacing={6} align="stretch">
            {/* Main Image */}
            <Box>
                <Text fontWeight="bold" mb={2}>
                    Main Image
                </Text>
                {mainImage ? (
                    <>
                        {renderImageBox(mainImage, 0, true)}
                        <Button
                            mt={2}
                            colorScheme="blue"
                            size="sm"
                            onClick={onSaveMainImage}
                        >
                            Save
                        </Button>
                    </>
                ) : (
                    <Box
                        as="label"
                        border="2px dashed gray"
                        borderRadius="10px"
                        height="150px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="column"
                        cursor="pointer"
                        _hover={{ borderColor: "blue.400" }}
                    >
                        <FiUpload size={24} color="gray" />
                        <Text fontSize="xs" color="gray.500">
                            Upload Main Image
                        </Text>
                        <Input
                            type="file"
                            accept="image/*"
                            display="none"
                            ref={mainFileInputRef}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileChange(file, onMainImageChange);
                            }}
                        />
                    </Box>
                )}
            </Box>

            {/* Additional Images */}
            <Box mt={10}>
                <Text fontWeight="bold" mb={2}>
                    Product Images (up to 5)
                </Text>
                <SimpleGrid columns={[1, 1, 2, 3]} spacing={6}>
                    {imageUrlArray.map((img, index) =>
                        renderImageBox(img, index)
                    )}
                    {imageUrlArray.length < 5 &&
                        Array.from({ length: 5 - imageUrlArray.length }).map(
                            (_, i) => renderAddBox(i + imageUrlArray.length)
                        )}
                </SimpleGrid>
                {imageUrlArray.length > 0 && (
                    <Button
                        mt={4}
                        colorScheme="blue"
                        size="sm"
                        onClick={onSaveImageArray}
                    >
                        Save Images
                    </Button>
                )}
            </Box>
        </VStack>
    );
}