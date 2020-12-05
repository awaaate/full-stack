import { withUrqlClientHOC } from "../../utils/createUrqlClient";
import { useQueryIntId } from "../../utils/useQueryIntId";
import { EditPostForm } from "../../components/EditPost";
import { Layout } from "../../components/Layout";
import { usePostQuery, useUpdatePostMutation } from "../../generated/graphql";
import { useRouter } from "next/router";

const LoadingState = () => <div>Loading</div>;
const ErrorState = () => <div>Error</div>;
export interface UpdatePostProps {}

export const UpdatePost: React.FC<UpdatePostProps> = ({}) => {
    const router = useRouter();
    const [, updatePost] = useUpdatePostMutation();
    const intId = useQueryIntId();
    const [{ data, fetching }] = usePostQuery({
        pause: intId === -1,
        variables: {
            id: intId,
        },
    });

    if (fetching) {
    }
    return (
        <Layout>
            {fetching ? (
                <LoadingState />
            ) : !data?.post ? (
                <ErrorState />
            ) : (
                <EditPostForm
                    initialValues={{
                        title: data.post.title,
                        text: data.post.text,
                    }}
                    submitButton="edit post"
                    onSubmit={async (values) => {
                        updatePost({ ...values, id: intId });
                        router.back();
                    }}
                />
            )}
        </Layout>
    );
};

export default withUrqlClientHOC()(UpdatePost);
