import DataLoader from "dataloader";
import { Comment } from "../../entities/comment.entity";

export const createCommentsLoader = () =>
    new DataLoader<number, Comment | null>(async (keys) => {
        const comments = await Comment.findByIds(keys as any);
        const commentIdsToComment: Record<string, Comment> = {};
        comments.forEach((comment) => {
            commentIdsToComment[`${comment.postId}`] = comment;
        });

        const storedComments = keys.map((key) => commentIdsToComment[`${key}`]);
        return storedComments;
    });
