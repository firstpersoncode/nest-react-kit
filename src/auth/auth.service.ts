import { Injectable, UnauthorizedException } from '@nestjs/common'

import { BaseGuard } from '../utils/guards/base.guard'
import { AdminEntity } from '../admin/admin.entity'
import { AdminService } from '../admin/admin.service'

import { AuthLogin } from './dtos/auth.login.dto'

@Injectable()
export class AuthService extends BaseGuard {
    constructor(private readonly adminService: AdminService) {
        super()
    }

    async login({ email, password }: AuthLogin): Promise<string> {
        const admin = await this.adminService.queryByEmail(email)
        const passwordMatch = await admin.checkPassword(password)

        if (!passwordMatch) {
            throw new UnauthorizedException(`Wrong password for admin with email: ${email}`)
        }

        const sign = this.signToken(admin)

        return sign
    }

    async logout(sign: string): Promise<boolean> {
        const token = await this.getToken(sign)
        await token.remove()

        return true
    }

    async session(sign: string): Promise<AdminEntity> {
        const token = await this.getToken(sign)
        const payload = await this.verifyToken(token)
        const admin = await this.getSession(payload)

        return admin
    }
}
