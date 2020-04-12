import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'
import { ObjectType, Field, Int } from 'type-graphql'

import { ProductEntity } from '../product/product.entity'

import { OrderEntity } from './order.entity'

@ObjectType()
@Entity('order-item')
export class OrderItemEntity extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn('increment')
    id: number

    @Field(() => Int)
    @Column()
    qty: number

    @Field(() => OrderEntity)
    @ManyToOne(
        () => OrderEntity,
        (order) => order.items
    )
    order: OrderEntity

    @Field(() => ProductEntity)
    @ManyToOne(
        () => ProductEntity,
        (product) => product.items,
        { cascade: true }
    )
    product: ProductEntity

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
