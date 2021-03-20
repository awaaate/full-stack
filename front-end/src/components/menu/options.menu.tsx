import {
    Avatar,
    Button,
    Grid,
    Link,
    Menu,
    MenuButton,
    Flex,
    MenuList,
    MenuItem,
    MenuItemProps,
    Icon,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import { FaPlus, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useMeQuery, useLogoutMutation } from "../../generated/graphql";
import { NextLink } from "../../lib/next.link";

export const OptionsMenu: React.FC = ({}) => {
    const router = useRouter();
    const [{ data, fetching }] = useMeQuery();
    const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

    const user = data?.me;
    if (user && !fetching) {
        return (
            <Grid gridTemplateColumns="1fr 1fr">
                <Menu>
                    <MenuButton>
                        <Avatar name={user.username} />
                    </MenuButton>
                    <MenuList bg="white" shadow="sm">
                        <CustomMenuItem icon={FaPlus as any}>
                            <NextLink href="/share-idea">
                                <Link>Share Idea</Link>
                            </NextLink>
                        </CustomMenuItem>
                        <CustomMenuItem icon={FaUser as any}>
                            <NextLink href="/profile">
                                <Link>Profile</Link>
                            </NextLink>
                        </CustomMenuItem>

                        <CustomMenuItem
                            icon={FaSignOutAlt as any}
                            onClick={() => logout()}
                        >
                            Log out
                        </CustomMenuItem>
                    </MenuList>
                </Menu>
            </Grid>
        );
    }
    return (
        <Grid gridTemplateColumns="1fr 1fr">
            <NextLink href="/login">
                <Link>
                    <Button variant="outline" borderWidth="2px">
                        Login
                    </Button>
                </Link>
            </NextLink>
            <NextLink href="/register">
                <Link>
                    <Button colorScheme="brand">Register</Button>
                </Link>
            </NextLink>
        </Grid>
    );
};
const CustomMenuItem: React.FC<MenuItemProps & { icon: any }> = ({
    icon,
    children,
    ...props
}) => (
    <MenuItem display="flex" justifyContent="space-between" {...props}>
        <Flex
            rounded="full"
            bg="gray.200"
            color="gray.600"
            w="2rem"
            h="2rem"
            justifyContent="center"
            alignItems="center"
        >
            <Icon as={icon as any} />
        </Flex>
        {children}
    </MenuItem>
);
