import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToMany
} from 'typeorm'
import { ObjectType, Field, Int } from 'type-graphql'

import { OrderItemEntity } from '../order/order-item.entity'

@ObjectType()
@Entity('product')
export class ProductEntity extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn('increment')
    id: number

    @Field(() => String)
    @Column()
    publicId: string

    @Field(() => Int)
    @Column({
        default: 1
    })
    status: number

    @Field(() => String)
    @Column()
    name: string

    @Field(() => String)
    @Column()
    sku: string

    @Field(() => String)
    @Column()
    size: string

    @Field(() => Int)
    @Column()
    stock: number

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    desc?: string

    @Field(() => [OrderItemEntity])
    @OneToMany(
        () => OrderItemEntity,
        (orderItem) => orderItem.product
    )
    items: OrderItemEntity[]

    @Field(() => String)
    @CreateDateColumn({
        type: 'timestamptz'
    })
    created: string

    @Field(() => String)
    @UpdateDateColumn({
        type: 'timestamptz'
    })
    updated: string

    @Field(() => Int)
    @Column({
        default: 0
    })
    archived: number
}
