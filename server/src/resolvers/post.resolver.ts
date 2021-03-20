import slugify from "slugify";
import {
    Arg,
    Ctx,
    Field,
    FieldResolver,
    InputType,
    Int,
    Mutation,
    ObjectType,
    Query,
    Resolver,
    Root,
    UseMiddleware,
} from "type-graphql";
import {
    Comment,
    Post,
    Topic,
    User,
} from "@generated/type-graphql";
import { parseTopics } from "../lib/functions/parse.topics";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types/ApolloContext";

@InputType()
class CreatePostInput {
    @Field()
    title: string;
    @Field()
    content: string;

    @Field(() => [String])
    topics: string[];
}
@InputType()
class UpdatePostInput {
    @Field({ nullable: true })
    title?: string;
    @Field({ nullable: true })
    content?: string;

    @Field(() => [String], { nullable: true })
    topics?: string[];
}

@ObjectType()
class PaginatedPost {
    @Field(() => [Post])
    posts: Post[];

    @Field()
    hasMore: boolean;
}
@Resolver(Post)
export class PostResolver {
    @FieldResolver(() => User)
    async creator(@Root() root: Post, @Ctx() { userLoader }: MyContext) {
        return userLoader.load(root.creatorId);
    }
    @FieldResolver(() => Comment, { nullable: true })
    async comments(@Root() root: Post, @Ctx() { commentsLoader }: MyContext) {
        return commentsLoader.load(root.id);
    }
    @FieldResolver(() => Int, { nullable: true })
    async voteStatus(
        @Root() root: Post,
        @Ctx() { updootLoader, req }: MyContext
    ) {
        const userId = req.session.userId;
        if (!userId) {
            return null;
        }
        const updoot = await updootLoader.load({ postId: root.id, userId });
        return updoot ? updoot.value : null;
    }
    @FieldResolver(() => [Topic])
    async topics(
        @Root() root: Post,
        @Ctx() { prisma }: MyContext
    ) {
        return prisma.post.findUnique({ where: { id: root.id } }).topics();
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async vote(
        @Arg("postId", () => Int) postId: number,
        @Arg("value", () => Int) value: number,
        @Ctx() { req, prisma }: MyContext
    ) {
        const isUpdoot = value > 0;
        const realValue = isUpdoot ? 1 : -1;
        const userId = req.session.userId;

        await prisma.updoot.upsert({
            where: { userId_postId: { postId: postId, userId: userId } },
            update: { value: realValue },
            create: {
                post: { connect: { id: postId } },
                user: { connect: { id: userId } },
                value: realValue,
            },
        });

        return true;
    }
    @Query(() => PaginatedPost)
    async posts(
        @Arg("limit", () => Int) limit: number,
        @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
        @Ctx() { prisma }: MyContext
    ): Promise<PaginatedPost> {
        const rateLimit = Math.min(50, limit);
        const rateLimitPlusOne = rateLimit + 1;

        const posts = await prisma.post.findMany({
            where: cursor
                ? { createdAt: { lt: new Date(parseInt(cursor)) } }
                : {},
            orderBy: { createdAt: "desc" },
            take: rateLimitPlusOne,
        });

        return {
            posts: posts,
            hasMore: posts.length === rateLimitPlusOne,
        };
    }
    @Query(() => Post, { nullable: true })
    async post(@Arg("id", () => Int) id: number, @Ctx() { prisma }: MyContext) {
        const post = await prisma.post.findUnique({
            where: { id },
        });
        return post;
    }
    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    async createPost(
        @Arg("input") input: CreatePostInput,
        @Ctx() { req, prisma }: MyContext
    ) {
        const slug = slugify(input.title);
        const post = await prisma.post.create({
            data: {
                ...input,
                slug,
                user: { connect: { id: req.session.userId } },
                topics: {
                    connectOrCreate: parseTopics(input.topics),
                },
            },
        });
        return post;
    }

    @Mutation(() => Post, { nullable: true })
    @UseMiddleware(isAuth)
    async updatePost(
        @Arg("id", () => Int) id: number,
        @Arg("input", () => UpdatePostInput) input: UpdatePostInput,
        @Ctx()
        { prisma }: MyContext
    ): Promise<Post | null> {
        return prisma.post.update({
            where: { id },
            data: {
                ...input,
                topics: input.topics && {
                    connectOrCreate: parseTopics(input.topics),
                },
            },
        });
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deletePost(
        @Arg("id", () => Int) id: number,
        @Ctx() { req, prisma }: MyContext
    ): Promise<Boolean> {
        const post = await prisma.post.findUnique({ where: { id } });
        if (!post) {
            return false;
        }
        if (req.session.userId !== post.creatorId) {
            throw new Error("not authorized");
        }
        /*     await Updoot.delete({ postId: post.id });
        await Post.delete({ id, creatorId: req.session.userId }); */
        await prisma.updoot.deleteMany({ where: { postId: post.id } });
        await prisma.post.delete({ where: { id: id } });

        return true;
    }
}
