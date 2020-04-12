import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AdminModule } from '../admin'
import { CustomerModule } from '../customer'
import { ProductModule } from '../product'

import { OrderController } from './order.controller'
import { OrderService } from './order.service'
import { OrderEntity } from './order.entity'
import { OrderItemEntity } from './order-item.entity'
import { OrderResolver } from './order.resolver'

@Module({
    imports: [TypeOrmModule.forFeature([OrderEntity, OrderItemEntity]), CustomerModule, ProductModule, AdminModule],
    controllers: [OrderController],
    providers: [OrderService, OrderResolver],
    exports: [OrderService]
})
export class OrderModule {}
