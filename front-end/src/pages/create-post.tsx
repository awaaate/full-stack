import { useRouter } from "next/router";
import { EditPostForm } from "../components/EditPost";
import { useCreatePostMutation } from "../generated/graphql";
import { withUrqlClientHOC } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";
import { Layout } from "../components/Layout";

export interface CreatePostProps {}

const CreatePost: React.FC<CreatePostProps> = ({}) => {
    const router = useRouter();
    const [, createPost] = useCreatePostMutation();

    useIsAuth();
    return (
        <Layout>
            <EditPostForm
                submitButton="create post"
                onSubmit={async (values) => {
                    await createPost({ input: values });
                    router.push("/");
                }}
            />
        </Layout>
    );
};

export default withUrqlClientHOC({ ssr: true })(CreatePost);
