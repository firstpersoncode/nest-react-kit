import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import * as bcrypt from 'bcryptjs'

@Entity('admin')
export class AdminEntity extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column()
    publicId: string

    @Column({
        default: 0
    })
    role: number

    @Column()
    name: string

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @Column({ default: 0 })
    nto: number

    @Column({ default: 0 })
    ntc: number

    @CreateDateColumn({
        type: 'timestamptz'
    })
    created: string

    @UpdateDateColumn({
        type: 'timestamptz'
    })
    updated: string

    async checkPassword(plainPassword: string) {
        return await bcrypt.compare(plainPassword, this.password)
    }
}
