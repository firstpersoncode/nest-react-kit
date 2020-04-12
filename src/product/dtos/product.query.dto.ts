import { Field, Int, InputType } from 'type-graphql'
import { IsOptional } from 'class-validator'

@InputType()
export class ProductQuery {
    @Field(() => Int, {
        nullable: true
    })
    @IsOptional()
    take?: number

    @Field(() => Int, {
        nullable: true
    })
    @IsOptional()
    skip?: number

    @Field(() => String, {
        nullable: true
    })
    @IsOptional()
    order?: 'ASC' | 'DESC'

    @Field(() => String, {
        nullable: true
    })
    @IsOptional()
    orderBy?: string

    @Field(() => String, {
        nullable: true
    })
    @IsOptional()
    start?: string

    @Field(() => String, {
        nullable: true
    })
    @IsOptional()
    end?: string

    @Field(() => String, {
        nullable: true
    })
    @IsOptional()
    q?: string

    @Field(() => String || Int, {
        nullable: true
    })
    @IsOptional()
    v?: string | number
}
