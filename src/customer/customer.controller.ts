import { Get, Controller, Param, Body, Post, Delete, Put, Res, Query, NotFoundException } from '@nestjs/common'
import { Response } from 'express'
import * as fs from 'fs'

import { ADMIN_ROLE } from '../utils/constants'
import { AdminRole } from '../utils/decorators/admin-role.decorator'
import { Public } from '../utils/decorators/public.decorator'

import { CustomerService } from './customer.service'
import { CustomerCreate } from './dtos/customer.create.dto'
import { CustomerUpdate } from './dtos/customer.update.dto'
import { CustomerExport } from './dtos/customer.export.dto'
import { CustomerQuery } from './dtos/customer.query.dto'

@Controller('customer')
export class CustomerController {
    constructor(private readonly service: CustomerService) {}

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
            ...(take ? { take: Number(take) } : {}),
            ...(skip ? { skip: Number(skip) } : {}),
            order: order || 'DESC',
            ...(start ? { start } : {}),
            ...(end ? { end } : {}),
            ...(q ? { q } : {}),
            ...(v ? { v } : {})
        } as CustomerQuery

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

    @Get(':id/verify')
    @Public()
    public async verify(@Param('id') id: string, @Res() res: Response) {
        const customer = await this.service.verify(id)

        if (customer.isVerified) {
            return res.render('notif-customer-verified', { email: customer.email })
        }

        return res.render('notif-error')
    }

    @Get(':id/verification')
    @Public()
    public async verification(@Param('id') id: string) {
        return await this.service.notifVerification(id)
    }

    @Get(':id/invite')
    @AdminRole(ADMIN_ROLE.read)
    async invitation(@Param('id') id: string) {
        return await this.service.notifInvitation(id)
    }

    @Post()
    @AdminRole(ADMIN_ROLE.write)
    async create(@Body() body: CustomerCreate) {
        const customer = await this.service.create(body)
        this.service.notifNewCustomer(customer)
        this.service.notifVerification(customer.publicId)

        return customer
    }

    @Post('export')
    @AdminRole(ADMIN_ROLE.read)
    async export(@Body() body: CustomerExport, @Query('orderBy') orderBy?: string, @Query('order') order?: string) {
        const options = {
            orderBy: orderBy || 'created',
            order: order || 'DESC'
        } as CustomerQuery

        return await this.service.export(body, options)
    }

    @Put(':id')
    @AdminRole(ADMIN_ROLE.write)
    async update(@Param('id') id: string, @Body() body: CustomerUpdate) {
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
