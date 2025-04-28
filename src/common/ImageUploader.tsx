import { Box, Text, IconButton, Image, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { FiUpload, FiX } from 'react-icons/fi';

type ImageUploaderProps = {
    msg?: string;
    file: File | null;
    onUpload: (file: File) => void;
    onRemove: () => void;
};

export default function ImageUploader({ msg, file, onUpload, onRemove }: ImageUploaderProps) {

  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!acceptedTypes.includes(selectedFile.type)) {
        setError('Only JPG, PNG, and JPEG image files are allowed');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File must be smaller than 5MB');
        return;
      }
      onUpload(selectedFile);
    }
  };

  return (
    <Box
      border="2px dashed gray"
      borderRadius="10px"
      height="200px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      overflow="hidden"
      position="relative"
      cursor="pointer"
      _hover={{ borderColor: "blue.400" }}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ position: "absolute", width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
      />

      {file ? (
        <>
          <Image
            src={URL.createObjectURL(file)}
            alt="Preview"
            objectFit="cover"
            width="100%"
            height="100%"
          />
          <IconButton
            aria-label="Remove image"
            icon={<FiX />}
            size="sm"
            colorScheme="red"
            position="absolute"
            top="8px"
            right="8px"
            onClick={(e) => {
              e.stopPropagation(); // prevent opening file input
              onRemove();
            }}
          />
        </>
      ) : (
            <VStack spacing={2}>
                <FiUpload size={32} color="gray" />
                <Text fontSize="sm" color="gray.500">{msg ?? "Click to upload image"}</Text>
                <Text fontSize="xs" color="gray.400">(Max size: 5MB)</Text>
          </VStack>
      )}


        {error && (
            <Text fontSize="sm" color="red.400">
                {error}
            </Text>
            )}
    </Box>
  );
}




// import { Box, IconButton, Image, Text, VStack } from '@chakra-ui/react';
// import { useState } from 'react';
// import { FiUpload, FiX } from 'react-icons/fi';

// export default function ImageUploader({ onUpload }: { onUpload: (file: File | null) => void }) {
//   const [preview, setPreview] = useState<string | null>(null);
//   const [error, setError] = useState<string>("");

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];

//     if (!file) return;

//     // Validate type
//     if (!file.type.startsWith('image/')) {
//       setError('Only image files are allowed');
//       return;
//     }

//     // Validate size
//     if (file.size > 5 * 1024 * 1024) {
//       setError('File must be less than 5MB');
//       return;
//     }

//     setError('');
//     setPreview(URL.createObjectURL(file));
//     onUpload(file);
//   };

//   const handleRemove = () => {
//     setPreview(null);
//     onUpload(null);
//   };

//   return (
//     <VStack spacing={2} align="start" w="full">
//       <Box
//         as="label"
//         htmlFor="image-upload"
//         w="100%"
//         h="250px"
//         border="2px dashed"
//         borderColor="gray.700"
//         borderRadius="md"
//         display="flex"
//         alignItems="center"
//         justifyContent="center"
//         position="relative"
//         cursor="pointer"
//         overflow="hidden"
//         _hover={{ borderColor: 'gray.500' }}
//       >
//         <input
//           type="file"
//           accept="image/*"
//           id="image-upload"
//           style={{ display: 'none' }}
//           onChange={handleFileChange}
//         />

//         {preview ? (
//           <>
//             <Image src={preview} alt="Preview" objectFit="cover" w="100%" h="100%" />
//             <IconButton
//               icon={<FiX />}
//               size="sm"
//               colorScheme="red"
//               position="absolute"
//               top="10px"
//               right="10px"
//               aria-label="Remove image"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleRemove();
//               }}
//             />
//           </>
//         ) : (
//           <VStack spacing={2}>
//             <FiUpload size={32} color="gray" />
//             <Text fontSize="sm" color="gray.500">
//               Click to upload image
//             </Text>
//             <Text fontSize="xs" color="gray.400">
//               (Max size: 5MB)
//             </Text>
//           </VStack>
//         )}
//       </Box>

//       {error && (
//         <Text fontSize="sm" color="red.400">
//           {error}
//         </Text>
//       )}
//     </VStack>
//   );
// }