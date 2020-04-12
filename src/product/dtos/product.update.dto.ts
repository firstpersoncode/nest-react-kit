import { Field, Int } from 'type-graphql'
import { Length, IsInt, IsOptional, MaxLength, Min, Max } from 'class-validator'

export class ProductUpdate {
    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1)
    status?: number

    @Field(() => String, { nullable: true })
    @IsOptional()
    @Length(3, 100)
    name?: string

    @Field(() => String, { nullable: true })
    @IsOptional()
    @Length(3, 50)
    sku?: string

    @Field(() => String, { nullable: true })
    @IsOptional()
    @MaxLength(2)
    size?: string

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    @Min(0)
    stock?: number

    @Field(() => String, { nullable: true })
    @IsOptional()
    @Length(3, 255)
    desc?: string
}
