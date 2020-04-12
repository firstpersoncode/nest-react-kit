import { Injectable, NotFoundException, UnauthorizedException /* HttpService */ } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MailerService } from '@nestjs-modules/mailer'
import { json2csvAsync } from 'json-2-csv'
import * as fs from 'fs'
import * as path from 'path'
import * as mime from 'mime-types'
// import { map } from 'rxjs/operators'

import { uuid } from '../utils/uuid'
import { STATUS, ORDER_STATUS } from '../utils/constants'
import { ExportFile } from '../utils/types/file.interface'
import { AdminService } from '../admin/admin.service'

import { CustomerEntity } from './customer.entity'
import { CustomerCreate } from './dtos/customer.create.dto'
import { CustomerUpdate } from './dtos/customer.update.dto'
import { CustomerExport } from './dtos/customer.export.dto'
import { CustomerQuery } from './dtos/customer.query.dto'

@Injectable()
export class CustomerService {
    constructor(
        @InjectRepository(CustomerEntity)
        private readonly repository: Repository<CustomerEntity>,
        private readonly adminService: AdminService,
        private readonly mailerService: MailerService // private readonly httpService: HttpService
    ) {}

    async queryAll(options: CustomerQuery): Promise<CustomerEntity[]> {
        const { skip, take, order, orderBy, start, end, q, v } = options
        const query = this.repository
            .createQueryBuilder('customer')
            .leftJoinAndSelect('customer.orders', 'order', 'order.archived = :archived', {
                archived: 0
            })
            .where('customer.archived = :archived', { archived: 0 })

        if (start && !end) {
            query.andWhere('customer.created >= :start ', { start })
        } else if (!start && end) {
            query.andWhere('customer.created < :end ', { end })
        } else if (start && end) {
            query.andWhere('customer.created BETWEEN :start AND :end', { start, end })
        }

        if (q && v) {
            query.andWhere(`${q} = :v`, { v })
        }

        query.orderBy(`customer.${orderBy}`, order)

        if (skip) {
            query.skip(skip)
        }

        if (take) {
            query.take(take)
        }

        return await query.getMany()
    }

    async queryById(id: string): Promise<CustomerEntity> {
        const customer = await this.repository
            .createQueryBuilder('customer')
            .leftJoinAndSelect('customer.orders', 'order', 'order.archived = :archived', { archived: 0 })
            .leftJoinAndSelect('order.items', 'item')
            .leftJoinAndSelect('item.product', 'product')
            .where('customer.publicId = :publicId', { publicId: id })
            .getOne()

        if (!customer) {
            throw new NotFoundException('No customer found with id: ' + id)
        }

        return customer
    }

    async create(body: CustomerCreate): Promise<CustomerEntity> {
        const customer = new CustomerEntity()
        const fields = ['status', 'name', 'phone', 'email', 'shippingAddress', 'billingAddress', 'company']

        for (const field in body) {
            if (fields.includes(field)) {
                customer[field] = body[field]
            }
        }

        customer.publicId = uuid('C')
        await customer.save()
        await this.adminService.notifCustomer()

        return customer
    }

    async update(id: string, body: CustomerUpdate): Promise<CustomerEntity> {
        const customer = await this.queryById(id)
        const fields = ['status', 'name', 'phone', 'shippingAddress', 'billingAddress', 'company']

        for (const field in body) {
            if (fields.includes(field)) {
                customer[field] = body[field]
            }
        }

        await customer.save()

        return customer
    }

    async archive(id: string): Promise<CustomerEntity> {
        const customer = await this.queryById(id)

        if (customer.orders.length) {
            throw new UnauthorizedException('Cannot delete customer with id: ' + id + ', still has order ongoing')
        }

        customer.archived = 1
        await customer.save()

        return customer
    }

    async removeArchives(): Promise<CustomerEntity[]> {
        const customers = await this.repository.find({ where: { archived: 1 } })
        let deleted = []

        for (const customer of customers) {
            const removed = Object.assign({}, customer)
            await customer.remove()
            deleted = [...deleted, removed]
        }

        return deleted
    }

    async verify(id: string): Promise<CustomerEntity> {
        const customer = await this.queryById(id)
        customer.isVerified = 1
        await customer.save()

        return customer
    }

    async validateOrdering(id: string): Promise<boolean> {
        const customer = await this.queryById(id)

        if (!customer.isVerified) {
            return false
        }

        const notEligible = [STATUS.notActive]

        if (notEligible.includes(customer.status)) {
            return false
        }

        return true
    }

    async notifNewCustomer(customer: CustomerEntity): Promise<boolean> {
        // email notification to PIC
        await this.mailerService.sendMail({
            to: 'nasser.maronie@gmail.com',
            from: 'nasser.maronie@gmail.com',
            subject: 'B2B - NEW CUSTOMER',
            template: 'notif-customer-new',
            context: {
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                shippingAddress: customer.shippingAddress,
                billingAddress: customer.billingAddress,
                company: customer.company
            }
        })

        return true
    }

    async notifVerification(id: string): Promise<CustomerEntity> {
        const customer = await this.queryById(id)

        if (customer.isVerified) {
            return customer
        }

        // email notification to PIC
        await this.mailerService.sendMail({
            to: customer.email,
            from: 'nasser.maronie@gmail.com',
            subject: 'B2B - Email Verification',
            template: 'notif-customer-verification',
            context: {
                name: customer.name,
                action: `http://localhost:${process.env.PORT}/customer/${id}/verify`
            }
        })

        return customer
    }

    async notifInvitation(id: string): Promise<CustomerEntity> {
        await this.validateOrdering(id)
        const customer = await this.queryById(id)

        // email notification to PIC
        await this.mailerService.sendMail({
            to: customer.email,
            from: 'nasser.maronie@gmail.com',
            subject: 'B2B - Invitation',
            template: 'notif-customer-invitation',
            context: {
                name: customer.name,
                action: `http://localhost:${process.env.PORT}/shop?cust="${id}"`
            }
        })

        return customer
    }

    async export(body: CustomerExport, options: CustomerQuery): Promise<ExportFile> {
        const { order, orderBy } = options

        const customers = await this.repository
            .createQueryBuilder('customer')
            .leftJoinAndSelect('customer.orders', 'order', 'order.archived = :archived', {
                archived: 0
            })
            .leftJoinAndSelect('order.items', 'item')
            .leftJoinAndSelect('item.product', 'product')
            .where('customer.archived = :archived', { archived: 0 })
            .andWhere('customer.publicId = ANY(:publicIds)', { publicIds: body.ids })
            .orderBy(`customer.${orderBy}`, order)
            .getMany()

        const dir = './tmp'

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        }

        const file = path.join(__dirname, '..', '..', dir, 'export-customers-' + Date.now() + '.csv')
        let data = []
        for (const customer of customers) {
            let col: any = {}
            let orders: string[] = []

            if (customer.orders.length) {
                for (const order of customer.orders) {
                    let items: string[] = []

                    for (const item of order.items) {
                        items = [...items, `${item.product.sku}: ${item.qty}`]
                    }

                    const orderData = [
                        `Status: ${Object.keys(ORDER_STATUS)[order.status]}`,
                        `Order ID: ${order.publicId}`,
                        'Items:',
                        `${items.join('\n')}`,
                        '---------------------------------------------'
                    ]

                    orders = [...orders, orderData.join('\n')]
                }
            }

            col.status = Object.keys(STATUS)[customer.status]
            col.id = customer.publicId
            col.isVerified = ['No', 'Yes'][customer.isVerified]
            col.name = customer.name
            col.email = customer.email
            col.phone = customer.phone
            col.billingAddress = customer.billingAddress
            col.shippingAddress = customer.shippingAddress
            col.orders = orders.join('\n')
            col.created = customer.created
            data = [...data, col]
        }

        const csv = await json2csvAsync(data)
        fs.writeFileSync(file, csv, 'binary')
        const stats = fs.statSync(file)
        const type = mime.contentType(mime.lookup(file))

        return { stats, name: path.basename(file), type, path: file }
    }

    // async createDummy() {
    //     return this.httpService.get('https://random-word-api.herokuapp.com/word?number=500').pipe(
    //         map(async (res) => {
    //             const words = res.data
    //             let i = 0
    //             for (const word of words) {
    //                 const rand = Math.floor(Math.random() * words.length)
    //                 const rand2 = Math.floor((Math.random() * words.length) / 2)
    //                 const rand4 = Math.floor((Math.random() * words.length) / 4)
    //                 const phone = Math.floor(100000000 + Math.random() * 900000000).toString()
    //
    //                 const customer = await this.create({
    //                     status: i % 2 === 0 ? 1 : 0,
    //                     name: word,
    //                     phone,
    //                     email: word + '.' + words[rand2] + '@' + words[rand4] + '.com',
    //                     shippingAddress: words[rand],
    //                     billingAddress: words[rand2],
    //                     company: words[rand4]
    //                 })
    //
    //                 await this.verify(customer.publicId)
    //                 i++
    //             }
    //
    //             return true
    //         })
    //     )
    // }
}
