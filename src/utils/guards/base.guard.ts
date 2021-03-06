import { UnauthorizedException } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import { getRepository } from 'typeorm'

import { AdminEntity } from '../../admin/admin.entity'
import { JWTPayload } from '../types/jwt.interface'

import { TokenEntity } from './token.entity'

export class BaseGuard {
    public async signToken(payload: AdminEntity): Promise<string> {
        // sign token
        const sign = jwt.sign(
            {
                sub: payload.publicId,
                role: payload.role
            },
            process.env.APP_SECRET,
            { expiresIn: '1h' }
        )
        const token = new TokenEntity()
        token.sign = sign
        await token.save()

        return token.sign
    }

    public async getToken(sign: string): Promise<TokenEntity> {
        const tokenRepository = getRepository(TokenEntity)
        const token = await tokenRepository.findOne({ where: { sign } })

        if (!token) {
            throw new UnauthorizedException('invalid')
        }

        return token
    }

    public async getSession(payload: JWTPayload): Promise<AdminEntity> {
        const adminRepository = getRepository(AdminEntity)
        const admin = await adminRepository.findOne({ where: { publicId: payload.sub } })

        return admin
    }

    public async verifyToken(token: TokenEntity): Promise<JWTPayload> {
        // decode token
        let payload: JWTPayload

        try {
            payload = jwt.verify(token.sign, process.env.APP_SECRET) as JWTPayload
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                await token.remove()
            }

            throw err
        }

        return payload
    }
}
