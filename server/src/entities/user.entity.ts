import {
    Entity,
    Column,
    UpdateDateColumn,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    BaseEntity,
    OneToMany,
    ManyToMany,
} from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
import { Post } from "./post.entity";
import { Updoot } from "./updoot.entity";
import { Comment } from "./comment.entity";

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @Column({ unique: true })
    username!: string;

    @Field(() => String)
    @Column({ unique: true })
    email!: string;

    @Column()
    password: string;

    @OneToMany(() => Post, (post) => post.creator)
    posts: Post[];

    
    @ManyToMany(() => Comment, (comment) => comment.post)
    comments: Comment[];

    @OneToMany(() => Updoot, (updoot) => updoot.user)
    updoots: Updoot[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}
