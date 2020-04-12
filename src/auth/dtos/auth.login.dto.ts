import { IsNotEmpty } from 'class-validator'
import { Field } from 'type-graphql'

export class AuthLogin {
    @Field(() => String)
    @IsNotEmpty()
    email: string

    @Field(() => String)
    @IsNotEmpty()
    password: string
}
