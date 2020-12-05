import { IconButton } from "@chakra-ui/core";
import Link from "next/link";
import { Fragment } from "react";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";

const DeletePostButton: React.FC<{ id: number }> = ({ id }) => {
    const [{ fetching }, deletePost] = useDeletePostMutation();
    return (
        <IconButton
            mr="3"
            aria-label="delete"
            icon="delete"
            isLoading={fetching}
            onClick={() => {
                deletePost({
                    id,
                });
            }}
        />
    );
};

export interface PostActionsButtonsProps {
    creatorId: number;
    postId: number;
}

export const PostActionsButtons: React.FC<PostActionsButtonsProps> = ({
    creatorId,
    postId,
}) => {
    const [{ data }] = useMeQuery();
    if (data?.me?.id !== creatorId) {
        return null;
    }
    return (
        <Fragment>
            <DeletePostButton id={postId} />
            <Link href="/edit/[id]" as={`/edit/${postId}`}>
                <a>
                    <IconButton aria-label="edit" icon="edit" />
                </a>
            </Link>
        </Fragment>
    );
};
