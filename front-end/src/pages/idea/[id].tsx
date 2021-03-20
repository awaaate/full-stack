import { Heading, Text, Flex, Box } from "@chakra-ui/react";
import { Layout } from "../../components/Layout";
import { usePostQuery } from "../../generated/graphql";
import { withUrqlClientHOC } from "../../utils/createUrqlClient";
import { useQueryIntId } from "../../utils/useQueryIntId";
import { PostActionsButtons } from "../../components/PostActionsButtons";

export interface PostProps {}

const Post: React.FC<PostProps> = ({}) => {
    const intId = useQueryIntId();
    const [{ data, fetching }] = usePostQuery({
        pause: intId === -1,
        variables: {
            id: intId,
        },
    });
    if (fetching) {
        return <Layout></Layout>;
    }
    if (!data?.post) {
        return <Layout></Layout>;
    }
    const { title, text, creator, id } = data.post;
    return (
        <Layout>
            <Flex justifyContent="center">
                <Box bg="white" w="90%" p={6} rounded="md">
                    <Heading>{title}</Heading>
                    <Text>{text}</Text>
                    <Text>created by {creator.username}</Text>
                    <PostActionsButtons creatorId={creator.id} postId={id} />
                </Box>
            </Flex>
        </Layout>
    );
};

export default withUrqlClientHOC({ ssr: true })(Post);
