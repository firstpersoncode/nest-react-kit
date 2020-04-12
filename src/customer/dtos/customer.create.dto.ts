import { Field, Int, InputType } from 'type-graphql'
import { Length, IsEmail, IsNumberString, IsOptional, IsInt, Min, Max, IsNotEmpty } from 'class-validator'

@InputType()
export class CustomerCreate {
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
    @IsNumberString()
    @Length(3, 30)
    phone: string

    @Field(() => String)
    @IsNotEmpty()
    @IsEmail()
    @Length(3, 100)
    email: string

    @Field(() => String)
    @IsNotEmpty()
    @Length(3, 255)
    shippingAddress: string

    @Field(() => String)
    @IsNotEmpty()
    @Length(3, 255)
    billingAddress: string

    @Field(() => String, { nullable: true })
    @IsOptional()
    @Length(3, 100)
    company?: string
}
