import {
    Box,
    Button,
    Flex,
    Heading,
    Icon,
    Link,
    Stack,
    Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useState } from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";
import { PostActionsButtons } from "./PostActionsButtons";

interface PostCardProps {
    posts: PostSnippetFragment[];
}

export const PostCard: React.FC<PostCardProps> = ({ posts }) => {
    const [loadingState, setLoadingState] = useState<{
        id: number;
        state: "up" | "down" | "not";
    }>({
        id: 0,
        state: "not",
    });
    const [{}, vote] = useVoteMutation();

    return (
        <Stack spacing={8} maxW="600px" m="auto" flexDir="column">
            {posts.map((post) => {
                if (!post) {
                    return null;
                }
                const {
                    title,
                    textSnippet,
                    points,
                    creator,
                    id,
                    voteStatus,
                } = post;
                return (
                    <Flex key={id} alignItems="center" minH="150px">
                        <Stack
                            p={2}
                            border="1px solid"
                            borderColor="gray.300"
                            rounded="md"
                            bg="white"
                            h="100%"
                            mr={5}
                            alignItems="center"
                            backgroundColor="gray.900"
                            color="white"
                            shadow="md"
                        >
                            <Button
                                rounded="md"
                                border="2px solid"
                                p={2}
                                isLoading={
                                    loadingState.state === "up" &&
                                    loadingState.id === id
                                }
                                onClick={async () => {
                                    if (voteStatus !== 1) {
                                        setLoadingState({ id, state: "up" });
                                        await vote({
                                            value: 1,
                                            postId: id,
                                        });
                                        setLoadingState({
                                            id: 0,
                                            state: "not",
                                        });
                                    }
                                }}
                                variantColor="gray.900"
                                variant="ghost"
                                color={voteStatus === 1 ? "red.500" : undefined}
                            >
                                <Icon name="triangle-up" size="14px" />
                            </Button>

                            <Box fontWeight="bold" fontSize="20px">
                                {points}
                            </Box>
                            <Button
                                rounded="md"
                                border="2px solid"
                                borderColor="gray.300"
                                p={2}
                                isLoading={
                                    loadingState.state === "down" &&
                                    loadingState.id === id
                                }
                                onClick={async () => {
                                    if (voteStatus !== -1) {
                                        setLoadingState({ id, state: "down" });
                                        await vote({
                                            value: -1,
                                            postId: id,
                                        });
                                        setLoadingState({
                                            id: 0,
                                            state: "not",
                                        });
                                    }
                                }}
                                variantColor="gray.900"
                                color={
                                    voteStatus === -1 ? "blue.500" : undefined
                                }
                            >
                                <Icon name="triangle-down" size="14px" />
                            </Button>
                        </Stack>
                        <Box
                            p={5}
                            border="1px solid"
                            borderColor="gray.300"
                            rounded="md"
                            bg="gray.100"
                            w="100%"
                            h="100%"
                        >
                            <NextLink href={`idea/${post.id}`}>
                                <Link>
                                    <Heading fontSize="xl">{title}</Heading>
                                </Link>
                            </NextLink>
                            <Flex
                                color="gray.700"
                                fontWeight={400}
                                opacity={0.7}
                            >
                                created by
                                <Text fontWeight={600} color="gray.800" ml={1}>
                                    {creator.username}
                                </Text>
                            </Flex>

                            <PostActionsButtons
                                creatorId={creator.id}
                                postId={post.id}
                            />
                        </Box>
                    </Flex>
                );
            })}
        </Stack>
    );
};
