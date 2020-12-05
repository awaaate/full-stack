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
} from "@chakra-ui/core";

export interface InputFieldProps {
    name: string;
    label: string;
    textarea?: boolean;
    inputLeftElementChildren?: React.ReactNode;
}

export const InputField: React.FC<
    InputFieldProps & InputHTMLAttributes<HTMLInputElement> & InputProps
> = ({ label, size: _, inputLeftElementChildren, textarea, ...props }) => {
    let InputOrTextArea = Input;
    let InputIconElement: null | React.ReactNode = null;
    if (textarea) {
        InputOrTextArea = Textarea;
    }
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
            <InputGroup>
                {InputIconElement}
                <InputOrTextArea
                    {...field}
                    {...props}
                    id={field.name}
                />
            </InputGroup>
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl>
    );
};
