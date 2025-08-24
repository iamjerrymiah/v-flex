import DOMPurify from "dompurify";
import { Input } from "@chakra-ui/react";

type SecureFormikInputProps = {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // same as Formik's handleChange
  [key: string]: any;
};

export function SecureFormikInput({ name, value, onChange, ...props }: SecureFormikInputProps) {
  return (
    <Input
      name={name}
      value={value}
      onChange={(e) => {
        const cleanValue = DOMPurify.sanitize(e.target.value, {
          ALLOWED_TAGS: [],
          ALLOWED_ATTR: [],
        });

        // Build a sanitized event so Formik still works the same
        const cleanEvent = {
          ...e,
          target: {
            ...e.target,
            name,
            value: cleanValue,
          },
        } as React.ChangeEvent<HTMLInputElement>;

        onChange(cleanEvent);
      }}
      {...props}
    />
  );
}