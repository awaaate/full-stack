import DataLoader from "dataloader";
import { User } from "@generated/type-graphql";
import { PrismaClient } from "@prisma/client";

// [1, 78, 8, 9]
// [{id: 1, username: 'tim'}, {}, {}, {}]
export const createUserLoader = (prisma: PrismaClient) =>
    new DataLoader<number, User>(async (userIds) => {
        const users = await prisma.user.findMany({
            where: { id: { in: [...userIds] } },
        });
        const userIdToUser: Record<number, User> = {};
        users.forEach((u) => {
            userIdToUser[u.id] = u;
        });

        const sortedUsers = userIds.map((userId) => userIdToUser[userId]);
        return sortedUsers;
    });
