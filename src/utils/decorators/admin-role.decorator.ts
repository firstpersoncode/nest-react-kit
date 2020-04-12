import { SetMetadata } from '@nestjs/common'

export const AdminRole = (role: number) => SetMetadata('role', role)
