import { Injectable, NotFoundException /* HttpService */ } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { json2csvAsync } from 'json-2-csv'
import * as fs from 'fs'
import * as path from 'path'
import * as mime from 'mime-types'
// import { map } from 'rxjs/operators'

import { uuid } from '../utils/uuid'
import { STATUS } from '../utils/constants'
import { ExportFile } from '../utils/types/file.interface'

import { ProductEntity } from './product.entity'
import { ProductCreate } from './dtos/product.create.dto'
import { ProductUpdate } from './dtos/product.update.dto'
import { ProductExport } from './dtos/product.export.dto'
import { ProductQuery } from './dtos/product.query.dto'

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly repository: Repository<ProductEntity>
    ) // private readonly httpService: HttpService
    {}

    async queryAll(options: ProductQuery): Promise<ProductEntity[]> {
        const { skip, take, order, orderBy, start, end, q, v } = options
        const query = this.repository
            .createQueryBuilder('product')
            .where('product.archived = :archived', { archived: 0 })

        if (start && !end) {
            query.andWhere('product.created >= :start ', { start })
        } else if (!start && end) {
            query.andWhere('product.created < :end ', { end })
        } else if (start && end) {
            query.andWhere('product.created BETWEEN :start AND :end', { start, end })
        }

        if (q && v) {
            query.andWhere(`${q} = :v`, { v })
        }

        query.orderBy(`product.${orderBy}`, order)

        if (skip) {
            query.skip(skip)
        }

        if (take) {
            query.take(take)
        }

        return await query.getMany()
    }

    async queryById(id: string): Promise<ProductEntity> {
        const product = await this.repository
            .createQueryBuilder('product')
            .where('product.publicId = :publicId', { publicId: id })
            .getOne()

        if (!product) {
            throw new NotFoundException('No product found with id: ' + id)
        }

        return product
    }

    async create(body: ProductCreate): Promise<ProductEntity> {
        const product = new ProductEntity()
        const fields = ['status', 'name', 'sku', 'size', 'stock', 'desc']

        for (const field in body) {
            if (fields.includes(field)) {
                product[field] = body[field]
            }
        }

        product.publicId = uuid('P')
        await product.save()

        return product
    }

    async update(id: string, body: ProductUpdate): Promise<ProductEntity> {
        const product = await this.queryById(id)
        const fields = ['status', 'name', 'sku', 'size', 'stock', 'desc']

        for (const field in body) {
            if (fields.includes(field)) {
                product[field] = body[field]
            }
        }

        await product.save()

        return product
    }

    async archive(id: string): Promise<ProductEntity> {
        const product = await this.queryById(id)
        product.archived = 1
        await product.save()

        return product
    }

    async removeArchives(): Promise<ProductEntity[]> {
        const products = await this.repository.find({ where: { archived: 1 } })
        let deleted = []

        for (const product of products) {
            const removed = Object.assign({}, product)
            await product.remove()
            deleted = [...deleted, removed]
        }

        return deleted
    }

    async validateOrdering(id: string, qty: number): Promise<boolean> {
        const product = await this.queryById(id)
        const notAvailable = [STATUS.notActive]

        if (notAvailable.includes(product.status)) {
            return false
        }

        const availableStock = product.stock - qty

        if (availableStock < 0) {
            return false
        }

        return true
    }

    async export(body: ProductExport, options: ProductQuery): Promise<ExportFile> {
        const { order, orderBy } = options

        const products = await this.repository
            .createQueryBuilder('product')
            .where('product.archived = :archived', { archived: 0 })
            .andWhere('product.publicId = ANY(:publicIds)', { publicIds: body.ids })
            .orderBy(`product.${orderBy}`, order)
            .getMany()

        const dir = './tmp'

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        }

        const file = path.join(__dirname, '..', '..', dir, 'export-products-' + Date.now() + '.csv')
        let data = []
        for (const product of products) {
            let col: any = {}

            col.status = Object.keys(STATUS)[product.status]
            col.id = product.publicId
            col.name = product.name
            col.sku = product.sku
            col.size = product.size
            col.stock = product.stock
            col.desc = product.desc
            col.created = product.created
            data = [...data, col]
        }

        const csv = await json2csvAsync(data)
        fs.writeFileSync(file, csv, 'binary')
        const stats = fs.statSync(file)
        const type = mime.contentType(mime.lookup(file))

        return { stats, name: path.basename(file), type, path: file }
    }

    // async createDummy() {
    //     return this.httpService.get('https://random-word-api.herokuapp.com/word?number=30').pipe(
    //         map(async (res) => {
    //             const words = res.data
    //             let i = 0
    //
    //             for (const word of words) {
    //                 const rand = Math.floor(Math.random() * words.length)
    //                 const rand2 = Math.floor((Math.random() * words.length) / 2)
    //
    //                 await this.create({
    //                     status: 1,
    //                     name: word,
    //                     sku: words[rand2].toLowerCase(),
    //                     size: i % 2 === 0 ? 'lg' : 'sm',
    //                     stock: 10000,
    //                     desc: words[rand]
    //                 })
    //                 i++
    //             }
    //
    //             return true
    //         })
    //     )
    // }
}
