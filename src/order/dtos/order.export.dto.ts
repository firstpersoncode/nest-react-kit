import { Field } from 'type-graphql'
import { IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator'

export class OrderExport {
    @Field(() => [String])
    @IsNotEmpty()
    @IsArray()
    @ArrayNotEmpty()
    ids: string[]
}
