import { IsInt, Min, Max, IsOptional } from 'class-validator'
import { Field, Int } from 'type-graphql'

export class AdminUpdate {
    @Field(() => Int)
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(2)
    role?: number

    @Field(() => String)
    @IsOptional()
    name?: string

    @Field(() => String)
    @IsOptional()
    email?: string

    @Field(() => String)
    @IsOptional()
    password?: string
}
