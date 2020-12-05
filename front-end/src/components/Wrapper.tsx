import { Box, BoxProps, Flex } from "@chakra-ui/core";

export interface WrapperProps {
    variant?: "small" | "regular";
}

export const Wrapper: React.FC<WrapperProps & BoxProps> = ({
    children,
    variant,
    ...props
}) => {
    return (
        <Flex w="100%" h="100%">
            <Box
                maxW={variant === "regular" ? 800 : 400}
                w="100%"
                mt={8}
                m="auto"
                bg="white"
                {...props}
            >
                {children}
            </Box>
        </Flex>
    );
};
