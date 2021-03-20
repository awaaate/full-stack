import DataLoader from "dataloader";
import { Updoot } from "@generated/type-graphql";
import { PrismaClient } from "@prisma/client";
export const createUpdootLoader = (prisma: PrismaClient) =>
    new DataLoader<{ postId: number; userId: number }, Updoot | null>(
        async (keys) => {
            const updoots = await prisma.updoot.findMany({
                where: {
                    postId: { in: keys.map((k) => k.postId) },
                    userId: { in: keys.map((k) => k.postId) },
                },
            });
            const updootIdsToUpdoot: Record<string, Updoot> = {};
            updoots.forEach((updoot) => {
                updootIdsToUpdoot[`${updoot.userId}|${updoot.postId}`] = updoot;
            });

            const sortedUpdoots = keys.map(
                (key) => updootIdsToUpdoot[`${key.userId}|${key.postId}`]
            );
            return sortedUpdoots;
        }
    );
