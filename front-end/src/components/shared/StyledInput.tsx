import { chakra } from "@chakra-ui/react";
import { InputField } from "../InputField";

export const StyledInput = chakra(InputField, {
    baseStyle: {
        shadow: "inner",
        bg: "gray.50",
        rounded: "sm",
    },
});
