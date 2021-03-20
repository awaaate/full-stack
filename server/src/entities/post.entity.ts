import { Field, Int, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Topic } from "./topic.entity";
import { Comment } from "./comment.entity";
import { Updoot } from "./updoot.entity";
import { User } from "./user.entity";
@ObjectType()
@Entity()
export class Post extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    title!: string;

    @Field()
    @Column()
    content!: string;

    @Field()
    @Column()
    slug: string;

    @Field()
    @Column({ type: "int", default: 0 })
    points!: number;

    @ManyToMany(() => Topic)
    @JoinTable()
    @Field(() => [Topic])
    topics: Topic[];

    @Field(() => Int, { nullable: true })
    voteStatus: number | null;

    @Field()
    @Column()
    creatorId: number;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.posts)
    creator: User;

    @OneToMany(() => Comment, (comments) => comments.post)
    comments: Comment[];

    @OneToMany(() => Updoot, (updoot) => updoot.post)
    updoots: Updoot[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}
