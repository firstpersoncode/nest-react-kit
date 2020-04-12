import { Get, Controller, Param, Body, Post, Delete, Put, Query } from '@nestjs/common'

import { ADMIN_ROLE } from '../utils/constants'
import { AdminRole } from '../utils/decorators/admin-role.decorator'
import { Owner } from '../utils/decorators/owner.decorator'
// import { Public } from '../utils/decorators/public.decorator'

import { AdminService } from './admin.service'
import { AdminCreate } from './dtos/admin.create.dto'
import { AdminUpdate } from './dtos/admin.update.dto'
import { AdminQuery } from './dtos/admin.query.dto'

@Controller('admin')
export class AdminController {
    constructor(private readonly service: AdminService) {}

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
        } as AdminQuery

        const admins = await this.service.queryAll(options)

        return admins.map((admin) => {
            delete admin.password

            return admin
        })
    }

    // @Get('dummy')
    // @Public()
    // async createDummy() {
    //     const result = await this.service.createDummy()
    //
    //     return result
    // }

    @Get(':id')
    @AdminRole(ADMIN_ROLE.read)
    async listById(@Param('id') id: string) {
        const admin = await this.service.queryById(id)
        delete admin.password

        return admin
    }

    @Get(':id/clear-notif/customer')
    @Owner()
    @AdminRole(ADMIN_ROLE.read)
    async clearNotifCustomer(@Param('id') id: string) {
        const admin = await this.service.clearNotifCustomer(id)
        delete admin.password

        return admin
    }

    @Get(':id/clear-notif/order')
    @Owner()
    @AdminRole(ADMIN_ROLE.read)
    async clearNotifOrder(@Param('id') id: string) {
        const admin = await this.service.clearNotifOrder(id)
        delete admin.password

        return admin
    }

    @Post()
    @AdminRole(ADMIN_ROLE.super)
    async create(@Body() body: AdminCreate) {
        const admin = await this.service.create(body)
        await this.service.notifInvitation(admin.publicId, body.password)
        delete admin.password

        return admin
    }

    @Put(':id')
    @Owner()
    @AdminRole(ADMIN_ROLE.write)
    async update(@Param('id') id: string, @Body() body: AdminUpdate) {
        const admin = await this.service.update(id, body)
        delete admin.password

        return admin
    }

    @Delete(':id')
    @Owner()
    @AdminRole(ADMIN_ROLE.write)
    async delete(@Param('id') id: string) {
        const admin = await this.service.remove(id)
        delete admin.password

        return admin
    }
}
