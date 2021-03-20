import { Prisma } from "@prisma/client";

export function parseTopics(
    topics: string[]
): Prisma.TopicCreateOrConnectWithoutPostInput[] {
    return topics.map((t) => ({
        where: { name: t.toLocaleLowerCase() },
        create: { name: t.toLocaleLowerCase() },
    }));
}
