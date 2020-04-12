import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MailerService } from '@nestjs-modules/mailer'
import { Repository } from 'typeorm'
import { json2csvAsync } from 'json-2-csv'
import * as fs from 'fs'
import * as path from 'path'
import * as mime from 'mime-types'

import { uuid } from '../utils/uuid'
import { ORDER_STATUS } from '../utils/constants'
import { ExportFile } from '../utils/types/file.interface'
import { AdminService } from '../admin/admin.service'
import { CustomerService } from '../customer/customer.service'
import { ProductService } from '../product/product.service'

import { OrderEntity } from './order.entity'
import { OrderCreate } from './dtos/order.create.dto'
import { OrderUpdate } from './dtos/order.update.dto'
import { OrderExport } from './dtos/order.export.dto'
import { OrderQuery } from './dtos/order.query.dto'

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly repository: Repository<OrderEntity>,
        private readonly adminService: AdminService,
        private readonly customerService: CustomerService,
        private readonly productService: ProductService,
        private readonly mailerService: MailerService
    ) {}

    async queryAll(options: OrderQuery): Promise<OrderEntity[]> {
        const { skip, take, order, orderBy, start, end, q, v } = options
        const query = this.repository
            .createQueryBuilder('order')
            .innerJoinAndSelect('order.customer', 'customer')
            .innerJoinAndSelect('order.items', 'item')
            .innerJoinAndSelect('item.product', 'product')
            .where('order.archived = :archived', { archived: 0 })

        if (start && !end) {
            query.andWhere('order.created >= :start ', { start })
        } else if (!start && end) {
            query.andWhere('order.created < :end ', { end })
        } else if (start && end) {
            query.andWhere('order.created BETWEEN :start AND :end', { start, end })
        }

        if (q && v) {
            query.andWhere(`${q} = :v`, { v })
        }

        query.orderBy(`order.${orderBy}`, order)

        if (skip) {
            query.skip(skip)
        }

        if (take) {
            query.take(take)
        }

        return await query.getMany()
    }

    async queryById(id: string): Promise<OrderEntity> {
        const order = await this.repository
            .createQueryBuilder('order')
            .innerJoinAndSelect('order.customer', 'customer')
            .innerJoinAndSelect('order.items', 'item')
            .innerJoinAndSelect('item.product', 'product')
            .where('order.publicId = :publicId', { publicId: id })
            .andWhere('order.archived = :archived', { archived: 0 })
            .getOne()

        if (!order) {
            throw new NotFoundException('No order found with id: ' + id)
        }

        return order
    }

    async create(customerId: string, body: OrderCreate): Promise<OrderEntity> {
        const eligible = await this.customerService.validateOrdering(customerId)

        if (!eligible) {
            throw new BadRequestException('customer id: ' + customerId + ' not eligible to make order')
        }

        const customer = await this.customerService.queryById(customerId)
        const order = new OrderEntity()
        order.customer = customer
        const fields = ['status', 'note']

        for (const field in body) {
            if (fields.includes(field)) {
                order[field] = body[field]
            }
        }

        for (const item of body.items) {
            const unavailable = await this.productService.validateOrdering(item.productId, item.qty)

            if (!unavailable) {
                throw new BadRequestException('product id: ' + item.productId + ' not available')
            }
        }

        let items = []

        for (const item of body.items) {
            const product = await this.productService.queryById(item.productId)
            const availableStock = product.stock - item.qty
            product.stock = availableStock
            const newItem = {
                ...item,
                product
            }
            items = [...items, newItem]
        }

        order.items = items
        order.publicId = uuid('O')
        await order.save()
        await this.adminService.notifOrder()

        return order
    }

    async update(id: string, body: OrderUpdate): Promise<OrderEntity> {
        const order = await this.queryById(id)
        const fields = ['status', 'note']

        for (const field in body) {
            if (fields.includes(field)) {
                order[field] = body[field]
            }
        }

        const currItems = order.items

        if (body.items && body.items.length) {
            for (const item of body.items) {
                const unavailable = await this.productService.validateOrdering(item.productId, item.qty)

                if (!unavailable) {
                    throw new BadRequestException('product id: ' + item.productId + ' not available')
                }
            }

            // restore stock
            let restockItems = []

            for (const item of currItems) {
                const product = await this.productService.queryById(item.product.publicId)
                const availableStock = product.stock + item.qty
                product.stock = availableStock
                item.archived = 1
                const restockItem = {
                    ...item,
                    product
                }
                restockItems = [...restockItems, restockItem]
            }

            order.items = restockItems
            await order.save()
            let items = []

            for (const item of body.items) {
                const product = await this.productService.queryById(item.productId)
                const availableStock = product.stock - item.qty
                product.stock = availableStock
                const newItem = {
                    ...item,
                    product
                }
                items = [...items, newItem]
            }

            order.items = items
        }

        if (typeof body.status !== 'undefined') {
            order.status = body.status
        }

        await order.save()

        return order
    }

    async archive(id: string): Promise<OrderEntity> {
        const order = await this.queryById(id)
        const notEligible = [ORDER_STATUS.shipping, ORDER_STATUS.delivered]

        if (notEligible.includes(order.status)) {
            throw new BadRequestException(
                'Cannot delete order id: ' + id + '. status already: ' + Object.keys(ORDER_STATUS)[order.status]
            )
        }

        // restore stock
        for (const item of order.items) {
            const product = await this.productService.queryById(item.product.publicId)
            const availableStock = product.stock + item.qty
            product.stock = availableStock
            item.product = product
            item.archived = 1
        }

        order.archived = 1
        await order.save()

        return order
    }

    async removeArchives(): Promise<OrderEntity[]> {
        const orders = await this.repository.find({ where: { archived: 1 } })
        let deleted = []

        for (const order of orders) {
            const removed = Object.assign({}, order)
            await order.remove()
            deleted = [...deleted, removed]
        }

        return deleted
    }

    async notifNewOrder(order: OrderEntity): Promise<boolean> {
        // email notification to PIC
        await this.mailerService.sendMail({
            to: 'nasser.maronie@gmail.com',
            from: 'nasser.maronie@gmail.com',
            subject: 'B2B - NEW ORDER',
            template: 'notif-order-new',
            context: {
                customer: order.customer,
                note: order.note,
                items: order.items
            }
        })

        return true
    }

    async export(body: OrderExport, options: OrderQuery): Promise<ExportFile> {
        const { order, orderBy } = options

        const orders = await this.repository
            .createQueryBuilder('order')
            .innerJoinAndSelect('order.customer', 'customer')
            .innerJoinAndSelect('order.items', 'item')
            .innerJoinAndSelect('item.product', 'product')
            .where('order.archived = :archived', { archived: 0 })
            .andWhere('order.publicId = ANY(:publicIds)', { publicIds: body.ids })
            .orderBy(orderBy === 'customer' ? 'customer.name' : `order.${orderBy}`, order)
            .getMany()

        const dir = './tmp'

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        }

        const file = path.join(__dirname, '..', '..', dir, 'export-orders-' + Date.now() + '.csv')
        let data = []
        for (const order of orders) {
            let col: any = {}
            let items: string[] = []

            for (const item of order.items) {
                items = [...items, `${item.product.sku}: ${item.qty}`]
            }

            col.status = Object.keys(ORDER_STATUS)[order.status]
            col.id = order.publicId
            col.items = items.join('\n')
            col.shippingAddress = order.customer.shippingAddress
            col.billingAddress = order.customer.billingAddress
            col.customer = [
                `Name: ${order.customer.name}`,
                `Email: ${order.customer.email}`,
                `Phone: ${order.customer.phone}`
            ].join('\n')
            col.note = order.note
            col.created = order.created
            data = [...data, col]
        }

        const csv = await json2csvAsync(data)
        fs.writeFileSync(file, csv, 'binary')
        const stats = fs.statSync(file)
        const type = mime.contentType(mime.lookup(file))

        return { stats, name: path.basename(file), type, path: file }
    }

    // async createDummy() {
    //     const customers = await this.customerService.queryAll({ order: 'DESC', orderBy: 'created' })
    //     const products = await this.productService.queryAll({ order: 'DESC', orderBy: 'created' })
    //
    //     for (const customer of customers) {
    //         if (customer.status) {
    //             const order = await this.create(customer.publicId, {
    //                 items: products.map((product) => ({
    //                     productId: product.publicId,
    //                     qty: 10
    //                 }))
    //             })
    //
    //             await this.update(order.publicId, {
    //                 status: Math.floor(Math.random() * 4)
    //             })
    //         }
    //     }
    //
    //     return true
    // }
}
