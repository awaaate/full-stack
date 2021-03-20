import { Comment } from "@generated/type-graphql";
import { PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";


export const createCommentsLoader = (prisma: PrismaClient) =>
    new DataLoader<number, Comment | null>(async (keys) => {
        const comments = await prisma.comment.findMany({
            where: {
                id: { in: [...keys] },
            },
        });
        const commentIdsToComment: Record<string, Comment> = {};
        comments.forEach((comment) => {
            commentIdsToComment[`${comment.postId}`] = comment;
        });

        const storedComments = keys.map((key) => commentIdsToComment[`${key}`]);
        return storedComments;
    });
