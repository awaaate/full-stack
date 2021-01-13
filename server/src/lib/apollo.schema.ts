import { buildSchema } from "type-graphql";
import { PostResolver } from "../resolvers/post.resolver";
import { CommentResolver } from "../resolvers/comment.resolver";
import { UserResolver } from "../resolvers/users.resolver";

export async function ApolloSchema() {
    return buildSchema({
        resolvers: [PostResolver, UserResolver, CommentResolver],
        validate: false,
    });
}
