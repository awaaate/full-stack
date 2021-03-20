import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Redis } from "ioredis";
import { createCommentsLoader } from "../lib/loaders/comments.loader";
import { createUpdootLoader } from "../lib/loaders/updoot.loader";
import { createUserLoader } from "../lib/loaders/user.loader";
export type MyContext = {
    prisma: PrismaClient;
    req: Request & { session: Express.Request["session"] & { userId: any } };
    res: Response;
    redis: Redis;
    userLoader: ReturnType<typeof createUserLoader>;
    updootLoader: ReturnType<typeof createUpdootLoader>;
    commentsLoader: ReturnType<typeof createCommentsLoader>;
};
