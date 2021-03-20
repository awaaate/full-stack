import { PrismaClient } from "@prisma/client";
import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import { Express } from "express";
import session from "express-session";
import Redis from "ioredis";
import { MyContext } from "../types/ApolloContext";
import { ApolloSchema } from "./apollo.schema";
import { createSession } from "./create.session";
import { createCommentsLoader } from "./loaders/comments.loader";
import { createUpdootLoader } from "./loaders/updoot.loader";
import { createUserLoader } from "./loaders/user.loader";



export async function createServer(app: Express) {
    let redis = new Redis(process.env.REDIS);
    let RedisStore = connectRedis(session);
    app.set("proxy", 1);

    app.use(
        cors({
            origin: process.env.CORS_ORIGIN,
            credentials: true,
        })
    );
    //new RedisStore({ client: redis, disableTouch: true })
    app.use(
        session(
            createSession(new RedisStore({ client: redis, disableTouch: true }))
        )
    );

    app.listen(process.env.PORT, () => {
        console.log("server started on localhost: " + process.env.PORT);
    });

    const apolloServer = new ApolloServer({
        schema: await ApolloSchema(),
        context: ({ req, res }): MyContext => {
            const prisma = new PrismaClient();
            return {
                prisma,
                req: req as any,
                res,
                redis,
                userLoader: createUserLoader(prisma),
                updootLoader: createUpdootLoader(prisma),
                commentsLoader: createCommentsLoader(prisma),
            };
        },
    });

    apolloServer.applyMiddleware({
        app,
        cors: false,
    });
}
