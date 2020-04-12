import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MailerService } from '@nestjs-modules/mailer'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'

import { uuid } from '../utils/uuid'
import { ADMIN_ROLE } from '../utils/constants'

import { AdminEntity } from './admin.entity'
import { AdminCreate } from './dtos/admin.create.dto'
import { AdminUpdate } from './dtos/admin.update.dto'
import { AdminQuery } from './dtos/admin.query.dto'

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(AdminEntity)
        private readonly repository: Repository<AdminEntity>,
        private readonly mailerService: MailerService
    ) {}

    async queryAll(options: AdminQuery): Promise<AdminEntity[]> {
        const { skip, take, order, orderBy, start, end, q, v } = options
        const query = this.repository.createQueryBuilder('admin')

        if (start && !end) {
            query.where('admin.created >= :start ', { start })
        } else if (!start && end) {
            query.where('admin.created < :end ', { end })
        } else if (start && end) {
            query.where('admin.created BETWEEN :start AND :end', { start, end })
        }

        if (q && v) {
            query.andWhere(`${q} = :v`, { v })
        }

        query.orderBy(`admin.${orderBy}`, order)

        if (skip) {
            query.skip(skip)
        }

        if (take) {
            query.take(take)
        }

        return await query.getMany()
    }

    async queryById(id: string): Promise<AdminEntity> {
        const admin = await this.repository.findOne({ where: { publicId: id } })

        if (!admin) {
            throw new NotFoundException(`There isn't any admin with identifier: ${id}`)
        }

        return admin
    }

    async queryByEmail(email: string): Promise<AdminEntity> {
        const admin = await this.repository.findOne({ where: { email } })

        if (!admin) {
            throw new NotFoundException(`There isn't any admin with identifier: ${email}`)
        }

        return admin
    }

    async create(body: AdminCreate): Promise<AdminEntity> {
        let admin = await this.repository.findOne({ where: { email: body.email } })

        if (admin) {
            throw new BadRequestException('admin with email: ' + body.email + ' already exists')
        }

        admin = new AdminEntity()
        const fields = ['name', 'email', 'role']

        for (const field in body) {
            if (fields.includes(field)) {
                admin[field] = body[field]
            }
        }

        const salt = await bcrypt.genSalt()
        admin.password = await bcrypt.hash(body.password, salt)
        admin.publicId = uuid()
        await admin.save()

        return admin
    }

    async update(id: string, body: AdminUpdate): Promise<AdminEntity> {
        const admin = await this.queryById(id)
        const fields = ['name', 'email']

        if (admin.role >= ADMIN_ROLE.super) {
            fields.push('role')
        }

        for (const field in body) {
            if (fields.includes(field)) {
                admin[field] = body[field]
            }
        }

        if (typeof body.password !== 'undefined') {
            const salt = await bcrypt.genSalt()
            admin.password = await bcrypt.hash(body.password, salt)
        }

        await admin.save()

        return admin
    }

    async remove(id: string): Promise<AdminEntity> {
        const admin = await this.queryById(id)
        const archivedAdmin = Object.assign({}, admin)
        await admin.remove()

        return archivedAdmin
    }

    async notifInvitation(id: string, plainPassword: string): Promise<AdminEntity> {
        const admin = await this.queryById(id)
        // email notification for new admin
        await this.mailerService.sendMail({
            to: admin.email,
            from: 'nasser.maronie@gmail.com',
            subject: 'B2B - ACCESS Invitation',
            template: 'notif-admin-invitation',
            context: {
                name: admin.name,
                email: admin.email,
                password: plainPassword,
                action: `http://localhost:${process.env.PORT}/dashboard`
            }
        })

        return admin
    }

    async notifCustomer(): Promise<AdminEntity[]> {
        const admins = await this.queryAll({
            orderBy: 'created',
            order: 'DESC'
        })

        for (const admin of admins) {
            admin.ntc = admin.ntc + 1
            await admin.save()
        }

        return admins
    }

    async clearNotifCustomer(id: string): Promise<AdminEntity> {
        const admin = await this.queryById(id)

        admin.ntc = 0
        admin.save()

        return admin
    }

    async notifOrder(): Promise<AdminEntity[]> {
        const admins = await this.queryAll({
            orderBy: 'created',
            order: 'DESC'
        })

        for (const admin of admins) {
            admin.nto = admin.nto + 1
            await admin.save()
        }

        return admins
    }

    async clearNotifOrder(id: string): Promise<AdminEntity> {
        const admin = await this.queryById(id)

        admin.nto = 0
        admin.save()

        return admin
    }

    // async createDummy() {
    //     const dummyAdmins = [
    //         {
    //             role: 2,
    //             name: 'Root',
    //             email: 'root@root.com',
    //             password: 'root'
    //         },
    //         {
    //             role: 0,
    //             name: 'Admin Read Only',
    //             email: 'admin.read@root.com',
    //             password: 'read'
    //         },
    //         {
    //             role: 1,
    //             name: 'Admin Read and Write',
    //             email: 'admin.write@root.com',
    //             password: 'write'
    //         },
    //         {
    //             role: 2,
    //             name: 'Nasser Maronie',
    //             email: 'nasser.maronie@gmail.com',
    //             password: 'root'
    //         }
    //     ]
    //
    //     for (const dummyAdmin of dummyAdmins) {
    //         await this.create(dummyAdmin)
    //     }
    //
    //     return true
    // }
}
