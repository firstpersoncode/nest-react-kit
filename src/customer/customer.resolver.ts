import { Query, Resolver, Mutation, Args, ResolveProperty, Parent } from '@nestjs/graphql'

import { Public } from '../utils/decorators/public.decorator'
import { OrderEntity } from '../order/order.entity'

import { CustomerEntity } from './customer.entity'
import { CustomerService } from './customer.service'
import { CustomerCreate } from './dtos/customer.create.dto'

@Resolver(() => CustomerEntity)
export class CustomerResolver {
    constructor(private readonly service: CustomerService) {}

    /* ------ query ------ */
    @Query(() => CustomerEntity, { name: 'customer' })
    @Public()
    public async listById(@Args('id') id: string) {
        return await this.service.queryById(id)
    }

    @ResolveProperty('orders', () => [OrderEntity], { nullable: 'items' })
    public async listOrders(@Parent() { publicId: id }) {
        const customer = await this.service.queryById(id)

        return customer.orders
    }

    /* ------ mutation ------ */

    @Mutation(() => CustomerEntity, { name: 'customerCreate' })
    @Public()
    public async create(@Args('input') input: CustomerCreate) {
        const customer = await this.service.create(input)
        this.service.notifNewCustomer(customer)
        this.service.notifVerification(customer.publicId)

        return customer
    }
}
