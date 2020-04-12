import { IsNotEmpty, IsInt, Min, Max } from 'class-validator'
import { Field, Int } from 'type-graphql'

export class AdminCreate {
    @Field(() => Int)
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Max(2)
    role: number

    @Field(() => String)
    @IsNotEmpty()
    name: string

    @Field(() => String)
    @IsNotEmpty()
    email: string

    @Field(() => String)
    @IsNotEmpty()
    password: string
}
