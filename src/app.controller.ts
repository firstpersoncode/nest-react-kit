import { Controller, Res, Get } from '@nestjs/common'
import { Response } from 'express'
import { Public } from './utils/decorators/public.decorator'

@Controller()
export class AppController {
    @Get('dashboard')
    @Public()
    async renderDashboard(@Res() res: Response) {
        return res.render('dashboard')
    }
}
