import { Post, User } from "../generated/graphql";

export type PostType = { __typename?: "Post" } & Pick<
    Post,
    | "title"
    | "text"
    | "textSnippet"
    | "creatorId"
    | "updatedAt"
    | "createdAt"
    | "id"
> & {
        creator: { __typename?: "User" } & Pick<
            User,
            "id" | "email" | "username"
        >;
    };
