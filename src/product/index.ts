import { Module, HttpModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ProductEntity } from './product.entity'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'
import { ProductResolver } from './product.resolver'

@Module({
    imports: [HttpModule, TypeOrmModule.forFeature([ProductEntity])],
    controllers: [ProductController],
    providers: [ProductService, ProductResolver],
    exports: [ProductService]
})
export class ProductModule {}
