import { Query, Resolver, Args } from '@nestjs/graphql'

import { Public } from '../utils/decorators/public.decorator'

import { ProductService } from './product.service'
import { ProductEntity } from './product.entity'
import { ProductQuery } from './dtos/product.query.dto'

@Resolver(() => ProductEntity)
export class ProductResolver {
    constructor(private readonly service: ProductService) {}

    /* ------ query ------ */

    @Query(() => [ProductEntity], { name: 'products', nullable: 'items' })
    @Public()
    public async list(@Args('args') args: ProductQuery) {
        return await this.service.queryAll({
            ...args,
            orderBy: args.orderBy || 'created',
            order: args.order || 'DESC'
        })
    }
}
