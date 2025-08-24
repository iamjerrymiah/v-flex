import DOMPurify from "dompurify";
import { Input } from "@chakra-ui/react";

type SecureStateInputProps = {
  name?: string;
  value?: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
};

export function SecureInput({ name, value, onChange, ...props }: SecureStateInputProps) {
  return (
    <Input
      name={name}
      value={value}
      onChange={(e) => {
        const cleanValue = DOMPurify.sanitize(e.target.value, {
          ALLOWED_TAGS: [],
          ALLOWED_ATTR: [],
        });

        // create a synthetic event with sanitized value
        const cleanEvent = {
          ...e,
          target: {
            ...e.target,
            value: cleanValue,
          },
        } as React.ChangeEvent<HTMLInputElement>;

        onChange(cleanEvent);
      }}
      {...props}
    />
  );
}