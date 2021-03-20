import { Box } from "@chakra-ui/react";

export const LoginAndRegisterLayout: React.FC = ({ children }) => {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            h="100%"
            w="100%"
        >
            <Box
                bg="white"
                shadow="sm"
                rounded="md"
                p="10"
                w="100%"
                maxW="500px"
            >
                {children}
            </Box>
        </Box>
    );
};
