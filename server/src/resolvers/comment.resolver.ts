import {
    Arg,
    Ctx,
    Field,
    FieldResolver,
    InputType,
    Int,
    Mutation,
    Query,
    Resolver,
    Root,
    UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Comment } from "../entities/comment.entity";
import { User } from "../entities/user.entity";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types/ApolloContext";

@InputType()
class CommentInput {
    @Field()
    text: string;
    @Field()
    postId: number;
}

@Resolver(Comment)
export class CommentResolver {
    @FieldResolver(() => User)
    async creator(@Root() root: Comment, @Ctx() { userLoader }: MyContext) {
        return userLoader.load(root.creatorId);
    }

    @Query(() => [Comment])
    async comments(@Arg("postId", () => Int) postId: number) {
        const comments = await getConnection()
            .createQueryBuilder()
            .select("comment")
            .where("comment.postId =:id", { id: postId })
            .orderBy("comment.updateAt", "ASC")
            .getMany();
        return comments;
    }

    @Mutation(() => Comment, { nullable: true })
    @UseMiddleware(isAuth)
    async createComment(
        @Arg("input") input: CommentInput,
        @Ctx() { req }: MyContext
    ): Promise<Comment | null> {
        return Comment.create({
            ...input,
            creatorId: req.session && req.session.userId,
        }).save();
    }
    @Mutation(() => Comment, { nullable: true })
    @UseMiddleware(isAuth)
    async updateComment(
        @Arg("id", () => Int) id: number,
        @Arg("text") text: string,
        @Ctx() { req }: MyContext
    ): Promise<Comment | null> {
        const results = await getConnection()
            .createQueryBuilder()
            .update(Comment)
            .set({ text, edited: true })
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
    async deleteComment(
        @Arg("id", () => Int) id: number,
        @Ctx() { req }: MyContext
    ): Promise<Boolean> {
        const comment = await Comment.findOne(id);
        if (!comment) {
            return false;
        }
        if (req.session.userId !== comment.creatorId) {
            throw new Error("not authorized");
        }
        comment.remove()
        return true;
    }
}
