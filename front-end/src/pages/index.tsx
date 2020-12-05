import { Button, Flex } from "@chakra-ui/core";
import { useState } from "react";
import { Layout } from "../components/Layout";
import { PostCard } from "../components/PostCard";
import { usePostsQuery } from "../generated/graphql";
import { withUrqlClientHOC } from "../utils/createUrqlClient";
const Index = () => {
    const [variables, setVariables] = useState({
        limit: 15,
        cursor: null as null | string,
    });
    const [{ data, error, fetching }] = usePostsQuery({
        variables,
    });
    console.log(process.env);
    if (!fetching && !data) {
        return <p>Query failed for some reason {error?.message}</p>;
    }
    const posts = data?.posts.posts;
    return (
        <Layout>
            {posts ? <PostCard posts={posts} /> : null}
            {posts && data?.posts.hasMore ? (
                <Flex justifyContent="center">
                    <Button
                        variant="ghost"
                        isLoading={fetching}
                        p={6}
                        m={4}
                        rounded="md"
                        bg="white"
                        onClick={() => {
                            setVariables({
                                limit: variables.limit,
                                cursor: posts[posts.length - 1].createdAt,
                            });
                        }}
                    >
                        Load more
                    </Button>
                </Flex>
            ) : null}
        </Layout>
    );
};

export default withUrqlClientHOC({ ssr: true })(Index);
