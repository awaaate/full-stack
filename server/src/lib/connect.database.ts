import { createConnection } from "typeorm";
import path from "path";
import { Post } from "../entities/post.entity";
import { Updoot } from "../entities/updoot.entity";
import { User } from "../entities/user.entity";
import { Comment } from "../entities/comment.entity";
import { Topic } from "../entities/topic.entity";

export async function connectDatabase() {
  /*   const connection = await createConnection({
        type: "postgres",
        url: process.env.DATABASE_URL,
        synchronize: true,
        logging: true,
        migrations: [path.join(__dirname, "./migrations/*")],
        entities: [Post, User, Updoot, Comment, Topic],
    });

    await connection.runMigrations(); */
}
