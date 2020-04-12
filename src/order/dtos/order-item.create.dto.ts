import { Field, Int, InputType } from 'type-graphql'
import { Min, IsInt, Max, IsNotEmpty } from 'class-validator'

@InputType()
export class OrderItemCreate {
    @Field(() => String)
    @IsNotEmpty()
    productId: string

    @Field(() => Int)
    @IsNotEmpty()
    @IsInt()
    @Min(10)
    @Max(500)
    qty: number
}
