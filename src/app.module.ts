import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MailerModule } from '@nestjs-modules/mailer'

import * as ormconfig from './orm.config'
import * as gqlconfig from './gql.config'
import * as mailerconfig from './mailer.config'

import { AuthModule } from './auth'
import { AdminModule } from './admin'
import { CustomerModule } from './customer'
import { OrderModule } from './order'
import { ProductModule } from './product'

import { AppController } from './app.controller'

@Module({
    imports: [
        GraphQLModule.forRoot(gqlconfig),
        TypeOrmModule.forRoot(ormconfig),
        MailerModule.forRoot(mailerconfig),
        AuthModule,
        AdminModule,
        CustomerModule,
        OrderModule,
        ProductModule
    ],
    controllers: [AppController]
})
export class AppModule {}
