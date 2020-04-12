import { Field } from 'type-graphql'
import { IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator'

export class CustomerExport {
    @Field(() => [String])
    @IsNotEmpty()
    @IsArray()
    @ArrayNotEmpty()
    ids: string[]
}
