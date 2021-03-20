import { buildSchema } from "type-graphql";

import { CommentResolver } from "../resolvers/comment.resolver";
import { PostResolver } from "../resolvers/post.resolver";
import { TopicResolver } from "../resolvers/topics.resolver";
import { UserResolver } from "../resolvers/users.resolver";


export async function ApolloSchema() {
    return buildSchema({
        resolvers: [PostResolver, UserResolver, CommentResolver, TopicResolver],
        validate: false,
    });
}
