import { Field, Int } from 'type-graphql'
import { Type } from 'class-transformer'
import { Length, IsOptional, IsArray, ArrayNotEmpty, ValidateNested, Min, IsInt, Max } from 'class-validator'

import { OrderItemCreate } from './order-item.create.dto'

export class OrderUpdate {
    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(3)
    status?: number

    @Field(() => String, { nullable: true })
    @IsOptional()
    @Length(3, 255)
    note?: string

    @Field(() => [OrderItemCreate], { nullable: true })
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => OrderItemCreate)
    items?: OrderItemCreate[]
}
