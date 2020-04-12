import { Resolver, Mutation, Args, ResolveProperty, Parent } from '@nestjs/graphql'

import { CustomerEntity } from '../customer/customer.entity'
import { Public } from '../utils/decorators/public.decorator'

import { OrderService } from './order.service'
import { OrderCreate } from './dtos/order.create.dto'
import { OrderEntity } from './order.entity'
import { OrderItemEntity } from './order-item.entity'

@Resolver(() => OrderEntity)
export class OrderResolver {
    constructor(private readonly service: OrderService) {}

    /* ------ query ------ */

    @ResolveProperty('customer', () => CustomerEntity)
    public async listCustomerById(@Parent() { publicId: id }) {
        return await this.service.queryById(id)
    }

    @ResolveProperty('items', () => [OrderItemEntity])
    public async listItems(@Parent() { publicId: id }) {
        const order = await this.service.queryById(id)

        return order.items
    }

    /* ------ mutation ------ */

    @Mutation(() => OrderEntity, { name: 'orderCreate' })
    @Public()
    public async create(@Args('customerId') customerId: string, @Args('input') input: OrderCreate) {
        const order = await this.service.create(customerId, input)
        this.service.notifNewOrder(order)
        return order
    }
}
