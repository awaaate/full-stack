import { Cache, cacheExchange, Resolver } from "@urql/exchange-graphcache";
import gql from "graphql-tag";
import { withUrqlClient, WithUrqlClientOptions } from "next-urql";
import Router from "next/router";
import {
    dedupExchange,
    Exchange,
    fetchExchange,
    stringifyVariables,
} from "urql";
import { pipe, tap } from "wonka";
import {
    LoginMutation,
    LogoutMutation,
    MeDocument,
    MeQuery,
    RegisterMutation,
    VoteMutationVariables,
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";
import { isServer } from "./isServer";
export const errorExchange: Exchange = ({ forward }) => (ops$) => {
    return pipe(
        forward(ops$),
        tap(({ error }) => {
            if (error) {
                if (!isServer()) {
                    if (error.message.includes("not authenticated")) {
                        Router.replace("/login");
                    } else {
                        //Router.replace("/");
                    }
                }
            }
        })
    );
};

export interface PaginationParams {
    offsetArgument?: string;
    limitArgument?: string;
}

export const cursorPagination = (): Resolver => {
    return (_parent, fieldArgs, cache, info) => {
        const { parentKey: entityKey, fieldName } = info;

        const allFields = cache.inspectFields(entityKey);
        const fieldInfos = allFields.filter(
            (info) => info.fieldName === fieldName
        );
        const size = fieldInfos.length;
        if (size === 0) {
            return undefined;
        }
        const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
        const isItInTheCache = cache.resolve(
            cache.resolveFieldByKey(entityKey, fieldKey) as string,
            "posts"
        );

        info.partial = !isItInTheCache;
        const results: string[] = [];
        let hasMore = true;
        fieldInfos.forEach((fi) => {
            const key = cache.resolveFieldByKey(
                entityKey,
                fi.fieldKey
            ) as string;
            const data = cache.resolve(key, "posts") as string[];
            const _hasMore = cache.resolve(key, "hasMore");
            if (!_hasMore) {
                hasMore = _hasMore as boolean;
            }
            results.push(...data);
        });

        return {
            __typename: "PaginatedPost",
            hasMore,
            posts: results,
        };
    };
};

const invalidateAllPosts = (cache: Cache) => {
    const allFields = cache.inspectFields("Query");
    const fieldInfos = allFields.filter((info) => info.fieldName === "posts");
    fieldInfos.map((fi) => {
        cache.invalidate("Query", "posts", fi.arguments || {});
    });
};
export const createUrqlClient = (ssrExchange: any, ctx: any) => {
    let cookie = "";
    if (isServer() && ctx) {
        cookie = ctx.req.headers.cookie;
    }
    return {
        url: process.env.NEXT_PUBLIC_API_URL as string,
        fetchOptions: {
            credentials: "include" as const,
            headers: cookie ? { cookie } : undefined,
        },
        exchanges: [
            dedupExchange,
            cacheExchange({
                keys: {
                    PaginatedPost: () => null,
                },
                resolvers: {
                    Query: {
                        posts: cursorPagination(),
                    },
                },
                updates: {
                    Mutation: {
                        updatePost: (_results, args, cache, _info) => {
                            cache.writeFragment(
                                gql`
                                    fragment _ on Post {
                                        id
                                        title
                                        text
                                    }
                                `,
                                {
                                    id: args.id,
                                    title: args.title,
                                    text: args.txt,
                                } as any
                            );
                        },
                        deletePost: (_results, args, cache, _info) => {
                            cache.invalidate({
                                __typename: "Post",
                                id: args.id as number,
                            });
                        },
                        vote: (_results, args, cache, _info) => {
                            const {
                                postId,
                                value,
                            } = args as VoteMutationVariables;

                            const data = cache.readFragment(
                                gql`
                                    fragment _ on Post {
                                        id
                                        voteStatus
                                        points
                                    }
                                `,
                                { id: postId } as any
                            );
                            if (data) {
                                if (data.voteStatus === value) {
                                    return;
                                }
                                const newPoints =
                                    (data.points as number) +
                                    (!data.voteStatus ? 1 : 2) * value;
                                cache.writeFragment(
                                    gql`
                                        fragment __ on Post {
                                            points
                                            voteStatus
                                        }
                                    `,
                                    {
                                        id: postId,
                                        points: newPoints,
                                        voteStatus: value,
                                    } as any
                                );
                            }
                        },
                        createPost: (_results, _args, cache, _info) => {
                            invalidateAllPosts(cache);
                        },
                        login: ($results, _args, cache, _info) => {
                            invalidateAllPosts(cache);
                            betterUpdateQuery<LoginMutation, MeQuery>(
                                cache,
                                {
                                    query: MeDocument,
                                },
                                $results,
                                (result, query) => {
                                    if (result.login.errors) {
                                        return query;
                                    } else {
                                        return {
                                            me: result.login.user,
                                        };
                                    }
                                }
                            );
                        },
                        register: ($results, _args, cache, _info) => {
                            betterUpdateQuery<RegisterMutation, MeQuery>(
                                cache,
                                {
                                    query: MeDocument,
                                },
                                $results,
                                (result, query) => {
                                    if (result.register.errors) {
                                        return query;
                                    } else {
                                        return {
                                            me: result.register.user,
                                        };
                                    }
                                }
                            );
                        },
                        logout: ($results, _args, cache, _info) => {
                            betterUpdateQuery<LogoutMutation, MeQuery>(
                                cache,
                                {
                                    query: MeDocument,
                                },
                                $results,
                                (result, query) => {
                                    if (!result.logout) {
                                        return query;
                                    }
                                    return {
                                        me: null,
                                    };
                                }
                            );
                        },
                    },
                },
            }),
            errorExchange,
            ssrExchange,
            fetchExchange,
        ],
    };
};

export const withUrqlClientHOC = (options?: WithUrqlClientOptions) =>
    withUrqlClient(createUrqlClient, options);
