import { Get, Controller, Param, Body, Post, Delete, Put, Query, Res, NotFoundException } from '@nestjs/common'
import { Response } from 'express'
import * as fs from 'fs'

import { ADMIN_ROLE } from '../utils/constants'
import { AdminRole } from '../utils/decorators/admin-role.decorator'
// import { Public } from '../utils/decorators/public.decorator'

import { ProductService } from './product.service'
import { ProductCreate } from './dtos/product.create.dto'
import { ProductUpdate } from './dtos/product.update.dto'
import { ProductExport } from './dtos/product.export.dto'
import { ProductQuery } from './dtos/product.query.dto'

@Controller('product')
export class ProductController {
    constructor(private readonly service: ProductService) {}

    @Get()
    @AdminRole(ADMIN_ROLE.read)
    async list(
        @Query('take') take?: string,
        @Query('skip') skip?: string,
        @Query('orderBy') orderBy?: string,
        @Query('order') order?: string,
        @Query('start') start?: string,
        @Query('end') end?: string,
        @Query('q') q?: string,
        @Query('v') v?: string
    ) {
        const options = {
            orderBy: orderBy || 'created',
            order: order || 'DESC',
            ...(take ? { take: Number(take) } : {}),
            ...(skip ? { skip: Number(skip) } : {}),
            ...(start ? { start } : {}),
            ...(end ? { end } : {}),
            ...(q ? { q } : {}),
            ...(v ? { v } : {})
        } as ProductQuery

        return await this.service.queryAll(options)
    }

    // @Get('dummy')
    // @Public()
    // async createDummy() {
    //     const result = await this.service.createDummy()
    //
    //     return result
    // }

    @Get('download')
    @AdminRole(ADMIN_ROLE.read)
    download(@Query('path') path: string, @Res() res: Response) {
        const stats = fs.statSync(path)
        if (stats && stats.isFile()) {
            return res.download(path, (err: any) => {
                if (err) {
                    throw new NotFoundException(err)
                }

                fs.unlinkSync(path)
            })
        }
    }

    @Get(':id')
    @AdminRole(ADMIN_ROLE.read)
    async listById(@Param('id') id: string) {
        return await this.service.queryById(id)
    }

    @Post()
    @AdminRole(ADMIN_ROLE.write)
    async create(@Body() body: ProductCreate) {
        return await this.service.create(body)
    }

    @Post('export')
    @AdminRole(ADMIN_ROLE.read)
    async export(@Body() body: ProductExport, @Query('orderBy') orderBy?: string, @Query('order') order?: string) {
        const options = {
            orderBy: orderBy || 'created',
            order: order || 'DESC'
        } as ProductQuery

        return await this.service.export(body, options)
    }

    @Put(':id')
    @AdminRole(ADMIN_ROLE.write)
    async update(@Param('id') id: string, @Body() body: ProductUpdate) {
        return await this.service.update(id, body)
    }

    @Delete('clean')
    @AdminRole(ADMIN_ROLE.write)
    async deleteArchives() {
        return await this.service.removeArchives()
    }

    @Delete(':id')
    @AdminRole(ADMIN_ROLE.write)
    async delete(@Param('id') id: string) {
        return await this.service.archive(id)
    }
}
