import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./post.entity";
import { User } from "./user.entity";

@Entity()
export class Updoot extends BaseEntity {
    @Column({ type: "int" })
    value: number;

    @PrimaryColumn()
    userId: number;

    @ManyToOne(() => User, (user) => user.updoots)
    user: User;

    @PrimaryColumn()
    postId: number;

    @ManyToOne(() => Post, (post) => post.updoots)
    post: Post;
}
