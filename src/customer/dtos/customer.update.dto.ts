import { Field, Int } from 'type-graphql'
import { Length, IsNumberString, IsOptional, IsInt, Min, Max } from 'class-validator'

export class CustomerUpdate {
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
    @IsNumberString()
    @Length(3, 30)
    phone?: string

    @Field(() => String, { nullable: true })
    @IsOptional()
    @Length(3, 255)
    shippingAddress?: string

    @Field(() => String, { nullable: true })
    @IsOptional()
    @Length(3, 255)
    billingAddress?: string

    @Field(() => String, { nullable: true })
    @IsOptional()
    @Length(3, 100)
    company?: string
}
