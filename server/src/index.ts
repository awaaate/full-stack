import "reflect-metadata";
import "dotenv-safe/config";
import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import express from "express";
import session from "express-session";
import { createConnection } from "typeorm";
import Redis from "ioredis";
import { buildSchema } from "type-graphql";
import { COOKIE_NAME, __prod__ } from "./constants";

import { PostResolver } from "./resolvers/post.resolver";
import { UserResolver } from "./resolvers/users.resolver";

import { User } from "./entities/user.entity";
import { Post } from "./entities/post.entity";
import path from "path";
import { Updoot } from "./entities/updoot.entity";
import { createUserLoader } from "./utils/userDataLoader";
import { createUpdootLoader } from "./utils/createUpdootLoader";
// import { Post } from "./entities/Post";

const main = async () => {
    //sendEmail("ta@gmail.com", "hello");
    const connection = await createConnection({
        type: "postgres",
        url: process.env.DATABASE_URL,
        logging: true,
        migrations: [path.join(__dirname, "./migrations/*")],
        entities: [Post, User, Updoot],
    });

    await connection.runMigrations();
    const app = express();
    let RedisStore = connectRedis(session);
    let redis = new Redis(process.env.REDIS);
    app.set("proxy", 1);
    //a
    app.use(
        cors({
            origin: process.env.CORS_ORIGIN,
            credentials: true,
        })
    );
    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({ client: redis, disableTouch: true }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years,
                httpOnly: true,
                sameSite: "lax",
                secure: __prod__, // only works in https
            },
            saveUninitialized: false,
            secret: process.env.SESSION_SECRET as string,
            resave: false,
        })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PostResolver, UserResolver],
            validate: false,
        }),

        context: ({ req, res }) => {
            return {
                req,
                res,
                redis,
                userLoader: createUserLoader(),
                updootLoader: createUpdootLoader(),
            };
        },
    });

    apolloServer.applyMiddleware({
        app,
        cors: false,
    });
    app.listen(process.env.PORT, () => {
        console.log("server started on localhost" + process.env.PORT);
    });
};

main();
