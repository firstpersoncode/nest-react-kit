import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'
import { ObjectType, Field, Int } from 'type-graphql'

import { OrderEntity } from '../order/order.entity'

@ObjectType()
@Entity('customer')
export class CustomerEntity extends BaseEntity {
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

    @Field(() => String)
    @Column()
    name: string

    @Field(() => String)
    @Column({ unique: true })
    phone: string

    @Field(() => String)
    @Column({ unique: true })
    email: string

    @Field(() => String)
    @Column()
    shippingAddress: string

    @Field(() => String)
    @Column()
    billingAddress: string

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    company?: string

    @Field(() => [OrderEntity])
    @OneToMany(
        () => OrderEntity,
        (order) => order.customer
    )
    orders: OrderEntity[]

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

    @Field(() => Int)
    @Column({
        default: 0
    })
    isVerified: number
}
