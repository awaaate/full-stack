import {
    Field,
    InputType
} from "type-graphql";
@InputType()
export class UsernamePasswordType {
    @Field()
    username: string;
    @Field()
    password: string;
    @Field()
    email: string;
}
