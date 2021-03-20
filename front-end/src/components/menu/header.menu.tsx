import { Box, Flex, Link } from "@chakra-ui/react";
import { NextLink } from "../../lib/next.link";
import { OptionsMenu } from "./options.menu";

export interface HeaderMenuProps {}

export const HeaderMenu: React.FC<HeaderMenuProps> = ({}) => {
    return (
        <Box p="8" bg="white" shadow="sm">
            <Flex w="100%" maxW="1080px" m="auto" justifyContent="space-between">
                <NextLink href="/">
                    <Link>Ideas</Link>
                </NextLink>
                <Flex>
                    <OptionsMenu />
                </Flex>
            </Flex>
        </Box>
    );
};
