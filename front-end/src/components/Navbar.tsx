import { Box, Button, Flex, Grid, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

export interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const router = useRouter();
    const [{ data, fetching }] = useMeQuery();
    const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

    let userOptions = null;
    if (fetching) {
        userOptions = null;
    } else if (!data?.me) {
        userOptions = (
            <Fragment>
                <NextLink href="/login">
                    <Link>login</Link>
                </NextLink>
                <NextLink href="/register">
                    <Link>register</Link>
                </NextLink>
            </Fragment>
        );
    } else {
        userOptions = (
            <Fragment>
                <Button
                    variant="solid"
                    bg="orange.500"
                    color="white"
                    onClick={() => router.push("/create-post")}
                >
                    create post
                </Button>
                <Button
                    variant="link"
                    onClick={async () => {
                        await logout();
                        router.reload();
                    }}
                    isLoading={logoutFetching}
                >
                    logout
                </Button>
            </Fragment>
        );
    }

    return (
        <Flex
            bg="white"
            color="blue.900"
            px={10}
            py={6}
            borderBottom="2px solid"
            borderColor="gray.300"
            position="fixed"
            w="100%"
            zIndex={6}
            top="0"
            left="0"
        >
            <Box w="80%">
                <NextLink href="/">
                    <Link
                        m="auto"
                        textTransform="uppercase"
                        color="blue.900"
                        fontWeight="extrabold"
                        fontSize="26px"
                    >
                        Nupick
                    </Link>
                </NextLink>
            </Box>
            <Grid gridTemplateColumns="1fr 1fr" gap={5} width="30%" ml="0">
                {userOptions}
            </Grid>
        </Flex>
    );
};
