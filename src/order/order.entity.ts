import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToMany
} from 'typeorm'
import { ObjectType, Field, Int } from 'type-graphql'

import { CustomerEntity } from '../customer/customer.entity'

import { OrderItemEntity } from './order-item.entity'

@ObjectType()
@Entity('order')
export class OrderEntity extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn('increment')
    id: number

    @Field(() => String)
    @Column()
    publicId: string

    @Field(() => Int)
    @Column({
        default: 0
    })
    status: number

    @Field(() => CustomerEntity)
    @ManyToOne(
        () => CustomerEntity,
        (customer) => customer.orders
    )
    customer: CustomerEntity

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    note?: string

    @Field(() => [OrderItemEntity])
    @OneToMany(
        () => OrderItemEntity,
        (orderItem) => orderItem.order,
        { cascade: true }
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
