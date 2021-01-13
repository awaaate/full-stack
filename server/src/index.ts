import "dotenv-safe/config";
import express from "express";
import "reflect-metadata";
import { connectDatabase } from "./lib/connect.database";
import { createServer } from "./lib/create.server";


// import { Post } from "./entities/Post";

const main = async () => {
    //sendEmail("ta@gmail.com", "hello");
    await connectDatabase();
    const app = express();
    await createServer(app);
};

main();
