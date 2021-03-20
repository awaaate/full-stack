import { useField } from "formik";
import { InputHTMLAttributes } from "react";
import {
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    InputGroup,
    InputLeftElement,
    Textarea,
    InputProps,
} from "@chakra-ui/react";

export interface InputFieldProps {
    name: string;
    label: string;
    inputSize?: string;
    inputLeftElementChildren?: React.ReactNode;
}

export const InputField: React.FC<
    InputFieldProps & InputHTMLAttributes<HTMLInputElement> & InputProps
> = ({ label, inputLeftElementChildren, inputSize, ...props }) => {
    let InputIconElement: null | React.ReactNode = null;

    if (inputLeftElementChildren) {
        InputIconElement = (
            <InputLeftElement
                color="gray.300"
                children={inputLeftElementChildren}
            />
        );
    }
    const [field, { error }] = useField(props);
    return (
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={props.name}>{label}</FormLabel>
            <InputGroup size={inputSize}>
                {InputIconElement}
                <Input
                    {...field}
                    {...props}
                    id={field.name}
                    focusBorderColor="brand.500"
                />
            </InputGroup>
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl>
    );
};
