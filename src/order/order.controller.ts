import { Get, Controller, Param, Body, Post, Delete, Put, Query, Res, NotFoundException } from '@nestjs/common'
import { Response } from 'express'
import * as fs from 'fs'

import { ADMIN_ROLE } from '../utils/constants'
import { AdminRole } from '../utils/decorators/admin-role.decorator'
// import { Public } from '../utils/decorators/public.decorator'

import { OrderCreate } from './dtos/order.create.dto'
import { OrderUpdate } from './dtos/order.update.dto'
import { OrderService } from './order.service'
import { OrderExport } from './dtos/order.export.dto'
import { OrderQuery } from './dtos/order.query.dto'

@Controller('order')
export class OrderController {
    constructor(private readonly service: OrderService) {}

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
        } as OrderQuery

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

    @Post('export')
    @AdminRole(ADMIN_ROLE.read)
    async export(@Body() body: OrderExport, @Query('orderBy') orderBy?: string, @Query('order') order?: string) {
        const options = {
            orderBy: orderBy || 'created',
            order: order || 'DESC'
        } as OrderQuery

        return await this.service.export(body, options)
    }

    @Post(':customerId')
    @AdminRole(ADMIN_ROLE.write)
    async create(@Param('customerId') customerId: string, @Body() body: OrderCreate) {
        const order = await this.service.create(customerId, body)
        this.service.notifNewOrder(order)
        return order
    }

    @Put(':id')
    @AdminRole(ADMIN_ROLE.write)
    async update(@Param('id') id: string, @Body() body: OrderUpdate) {
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
