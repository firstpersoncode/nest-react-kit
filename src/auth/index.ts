import { Module } from '@nestjs/common'

import { AdminModule } from '../admin'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
    imports: [AdminModule],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule {}
