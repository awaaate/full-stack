import { RedisStore } from "connect-redis";
import { SessionOptions } from "express-session";
import { COOKIE_NAME, __prod__ } from "../constants";

export function createSession(store: RedisStore): SessionOptions {
    return {
        name: COOKIE_NAME,
        store: store,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years,
            httpOnly: false,
            sameSite: "lax",
            secure: __prod__, // only works in https
        },
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET as string,
        resave: false,
    };
}
