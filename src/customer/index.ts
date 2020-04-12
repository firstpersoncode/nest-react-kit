import { Module, HttpModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AdminModule } from '../admin'

import { CustomerEntity } from './customer.entity'
import { CustomerController } from './customer.controller'
import { CustomerService } from './customer.service'
import { CustomerResolver } from './customer.resolver'

@Module({
    imports: [HttpModule, TypeOrmModule.forFeature([CustomerEntity]), AdminModule],
    controllers: [CustomerController],
    providers: [CustomerService, CustomerResolver],
    exports: [CustomerService]
})
export class CustomerModule {}
