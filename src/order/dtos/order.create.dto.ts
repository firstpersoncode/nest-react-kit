import { Field, InputType } from 'type-graphql'
import { Type } from 'class-transformer'
import { Length, IsOptional, IsArray, ArrayNotEmpty, ValidateNested, IsNotEmpty } from 'class-validator'

import { OrderItemCreate } from './order-item.create.dto'

@InputType()
export class OrderCreate {
    @Field(() => String, { nullable: true })
    @IsOptional()
    @Length(3, 255)
    note?: string

    @Field(() => [OrderItemCreate])
    @IsNotEmpty()
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => OrderItemCreate)
    items: OrderItemCreate[]
}
