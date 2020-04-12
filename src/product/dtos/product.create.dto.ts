import { Field, Int } from 'type-graphql'
import { Length, IsInt, IsOptional, Min, Max, MinLength, IsNotEmpty } from 'class-validator'

export class ProductCreate {
    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1)
    status?: number

    @Field(() => String)
    @IsNotEmpty()
    @Length(3, 100)
    name: string

    @Field(() => String)
    @IsNotEmpty()
    @Length(3, 50)
    sku: string

    @Field(() => String)
    @IsNotEmpty()
    @MinLength(2)
    size: string

    @Field(() => Int)
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    stock: number

    @Field(() => String, { nullable: true })
    @IsOptional()
    @Length(3, 255)
    desc?: string
}
