import { Ctx, Query, Resolver } from "type-graphql";
import { Topic } from "@generated/type-graphql";
import { MyContext } from "../types/ApolloContext";

@Resolver(Topic)
export class TopicResolver {
    @Query(() => [Topic])
    async topics(@Ctx() { prisma }: MyContext) {
        return prisma.topic.findMany();
    }
}
