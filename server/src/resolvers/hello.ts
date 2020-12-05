import { Resolver, Query } from "type-graphql";

@Resolver()
export class HelloResolver{
    @Query(() => String)
    hello(){
        console.log('hello')
        return 'hello world'
    }
}