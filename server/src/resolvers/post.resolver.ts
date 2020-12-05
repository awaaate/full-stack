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
import { getConnection } from "typeorm";
import { Post } from "../entities/post.entity";
import { Updoot } from "../entities/updoot.entity";
import { User } from "../entities/user.entity";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types/ApolloContext";

@InputType()
class PostInput {
    @Field()
    title: string;
    @Field()
    text: string;
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
    @FieldResolver(() => String)
    textSnippet(@Root() root: Post) {
        const k = root.text.split(" ");
        return k.slice(0, Math.min(20, k.length)).join(" ").trim();
    }
    @FieldResolver(() => User)
    async creator(@Root() root: Post, @Ctx() { userLoader }: MyContext) {
        return userLoader.load(root.creatorId);
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
    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async vote(
        @Arg("postId", () => Int) postId: number,
        @Arg("value", () => Int) value: number,
        @Ctx() { req }: MyContext
    ) {
        const isUpdoot = value > 0;
        const realValue = isUpdoot ? 1 : -1;
        const { userId } = req.session;

        const updoot = await Updoot.findOne({ where: { postId, userId } });
        console.log(updoot, realValue);
        if (updoot && updoot.value !== realValue) {
            await getConnection().transaction(async (tr) => {
                await tr.query(
                    `
                    update updoot 
                    set value =$1
                    where "postId" = $2 and "userId" = $3
                `,
                    [realValue, postId, userId]
                );

                await tr.query(
                    `
                    update post 
                    set points = points + $1
                    where id = $2;
                `,
                    [2 * realValue, postId]
                );
            });
        } else if (!updoot) {
            await getConnection().transaction(async (tr) => {
                await tr.query(
                    `
                    insert into updoot ("userId", "postId", value)
                    values($1, $2, $3)
                `,
                    [userId, postId, realValue]
                );

                await tr.query(
                    `
                    update post 
                    set points = points + $1
                    where id = $2;
                `,
                    [realValue, postId]
                );
            });
        }

        return true;
    }
    @Query(() => PaginatedPost)
    async posts(
        @Arg("limit", () => Int) limit: number,
        @Arg("cursor", () => String, { nullable: true }) cursor: string | null
    ): Promise<PaginatedPost> {
        const rateLimit = Math.min(50, limit);
        const rateLimitPlusOne = rateLimit + 1;
        const replacements: any[] = [rateLimitPlusOne];

        if (cursor) {
            replacements.push(new Date(parseInt(cursor)));
        }
        const posts = await getConnection().query(
            `
            select p.*
            from post p  
            ${cursor ? `where p."createdAt" < $2` : ""} 
            order by p."createdAt" DESC
            limit $1

        `,
            replacements
        );
        return {
            posts: posts.slice(0, rateLimit),
            hasMore: posts.length === rateLimitPlusOne,
        };
    }
    @Query(() => Post, { nullable: true })
    post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
        return Post.findOne({ id }, { relations: ["creator"] });
    }
    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    async createPost(
        @Arg("input") input: PostInput,
        @Ctx() { req }: MyContext
    ): Promise<Post> {
        return Post.create({
            ...input,
            creatorId: req.session.userId,
        }).save();
    }

    @Mutation(() => Post, { nullable: true })
    @UseMiddleware(isAuth)
    async updatePost(
        @Arg("id", () => Int) id: number,
        @Arg("title") title: string,
        @Arg("text") text: string,
        @Ctx() { req }: MyContext
    ): Promise<Post | null> {
        const results = await getConnection()
            .createQueryBuilder()
            .update(Post)
            .set({ title, text })
            .where('id = :id and "creatorId" = :creatorId', {
                id,
                creatorId: req.session.userId,
            })
            .returning("*")
            .execute();
        return results.raw[0];
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deletePost(
        @Arg("id", () => Int) id: number,
        @Ctx() { req }: MyContext
    ): Promise<Boolean> {
        const post = await Post.findOne({ id });
        if (!post) {
            return false;
        }
        if (req.session.userId !== post.creatorId) {
            throw new Error("not authorized");
        }
        await Updoot.delete({ postId: post.id });
        await Post.delete({ id, creatorId: req.session.userId });

        return true;
    }
}
