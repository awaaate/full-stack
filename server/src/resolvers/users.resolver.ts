import argon2 from "argon2";
import { MyContext } from "../types/ApolloContext";
import {
    Arg,
    Ctx,
    Field,
    Mutation,
    ObjectType,
    Query,
    Resolver,
    Root,
    FieldResolver,
} from "type-graphql";
import { v4 } from "uuid";
import { COOKIE_NAME, FORGOT_PASSWORD_PREFIX } from "../constants";
import { UsernamePasswordType } from "../types/UsernamePassword";
import { sendEmail } from "../utils/sendEmail";
import { validateRegister } from "../utils/validateRegister";
import { FieldError } from "../types/FieldError";

import { User } from "@generated/type-graphql";
@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: [FieldError];

    @Field(() => User, { nullable: true })
    user?: User;
}

@Resolver(User)
export class UserResolver {
    @FieldResolver(() => String)
    email(@Root() user: User, @Ctx() { req }: MyContext) {
        //this si the current user
        if (req.session.userId === user.id) {
            return user.email;
        }

        return "";
    }

    @Query(() => User, { nullable: true })
    async me(@Ctx() { req, prisma }: MyContext) {
        // you are not logged in
        if (!req.session.userId) {
            return null;
        }

        return prisma.user.findUnique({ where: { id: req.session.userId } });
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg("options") options: UsernamePasswordType,
        @Ctx() { req, prisma }: MyContext
    ): Promise<UserResponse> {
        const errors = validateRegister(options);
        if (errors) {
            return { errors } as UserResponse;
        }
        const hashedPassword = await argon2.hash(options.password);

        try {
            const user = await prisma.user.create({
                data: {
                    email: options.email,
                    username: options.username,
                    password: hashedPassword,
                },
            });
            req.session.userId = user.id;

            return { user };
        } catch (error) {
            if (error.code === "23505") {
                //duplicated user error
                return {
                    errors: [
                        new FieldError(
                            "username",
                            "Username or email already taken "
                        ),
                    ],
                };
            }
        }
        return {
            errors: [new FieldError("database", "Error with this account")],
        };
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg("usernameOrEmail") usernameOrEmail: string,
        @Arg("password") password: string,
        @Ctx() { req, prisma }: MyContext
    ): Promise<UserResponse> {
        const isEmail = usernameOrEmail.includes("@");
        const user = await prisma.user.findUnique({
            where: isEmail
                ? { email: usernameOrEmail }
                : { username: usernameOrEmail },
        });

        if (!user) {
            return {
                errors: [
                    new FieldError(
                        "usernameOrEmail",
                        "that username doesn't exists"
                    ),
                ],
            };
        }
        const isValidPassword = await argon2.verify(user.password, password);

        if (!isValidPassword) {
            return {
                errors: [new FieldError("password", "incorrect  password")],
            };
        }
        req.session.userId = user.id;
        return {
            user,
        };
    }
    @Mutation(() => Boolean)
    logout(@Ctx() { req, res }: MyContext) {
        return new Promise((resolve) =>
            req.session.destroy((err) => {
                if (err) {
                    console.log(err);
                    resolve(false);
                    return;
                }
                res.clearCookie(COOKIE_NAME);
                resolve(true);
            })
        );
    }
    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg("email") email: string,
        @Ctx() { redis, prisma }: MyContext
    ) {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return true;
        }
        const token = v4();

        await redis.set(
            FORGOT_PASSWORD_PREFIX + token,
            user.id,
            "ex",
            1000 * 60 * 60 * 3
        ); // 3 hours
        sendEmail(
            email,
            `<a href="http://localhost:3000/change-password/${token}">reset password</a>`
        );
        return true;
    }
    @Mutation(() => UserResponse)
    async changePassword(
        @Arg("token") token: string,
        @Arg("newPassword") newPassword: string,
        @Ctx() { redis, req, prisma }: MyContext
    ): Promise<UserResponse> {
        if (newPassword.length <= 2) {
            return {
                errors: [
                    new FieldError(
                        "newPassword",
                        "Password must be at least 2 character or greater"
                    ),
                ],
            };
        }
        const key = FORGOT_PASSWORD_PREFIX + token;
        const userId = await redis.get(key);
        if (!userId) {
            return {
                errors: [new FieldError("token", "token has expired")],
            };
        }
        const userIdNum = parseInt(userId);
        const user = await prisma.user.findUnique({ where: { id: userIdNum } });

        if (!user) {
            return {
                errors: [new FieldError("token", "user no longer exists")],
            };
        }

        const password = await argon2.hash(newPassword);
        await prisma.user.update({
            where: { id: userIdNum },
            data: { password: password },
        });

        //log in after  change password
        redis.del(key);
        req.session.userId = user.id;
        return { user };
    }
}
