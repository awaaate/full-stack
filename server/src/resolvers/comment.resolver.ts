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
    UseMiddleware
} from "type-graphql";
import { Comment, User } from "@generated/type-graphql";
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
    async comments(
        @Arg("postId", () => Int) postId: number,
        @Ctx() { prisma }: MyContext
    ) {
        const comments = await prisma.comment.findMany({ where: { postId } });
        return comments;
    }

    @Mutation(() => Comment, { nullable: true })
    @UseMiddleware(isAuth)
    async createComment(
        @Arg("input") input: CommentInput,
        @Ctx() { req, prisma }: MyContext
    ) {
        const comment = await prisma.comment.create({
            data: {
                text: input.text,
                post: { connect: { id: input.postId } },
                user: { connect: { id: req.session.userId } },
            },
        });
        return comment;
    }
    @Mutation(() => Comment, { nullable: true })
    @UseMiddleware(isAuth)
    async updateComment(
        @Arg("id", () => Int) id: number,
        @Arg("text") text: string,
        @Ctx() { prisma }: MyContext
    ) {
        const comment = await prisma.comment.update({
            where: { id },
            data: { text, edited: true },
        });

        return comment;
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deleteComment(
        @Arg("id", () => Int) id: number,
        @Ctx() { req, prisma }: MyContext
    ) {
        const comment = await prisma.comment.findUnique({ where: { id } });
        if (!comment) {
            return false;
        }
        if (req.session.userId !== comment.creatorId) {
            throw new Error("not authorized");
        }
        await prisma.comment.delete({ where: { id } });
        return true;
    }
}
