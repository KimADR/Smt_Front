import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.user.findMany({
      select: { id: true, username: true, email: true, fullName: true, phone: true, avatar: true, role: true, isActive: true, createdAt: true },
    })
  }

  async create(input: any) {
    if (!input?.username || !input?.email || !input?.password) {
      throw new BadRequestException('username, email and password are required')
    }
    const hashed = await bcrypt.hash(String(input.password), 10)
    const roleEnum = (input.role ?? 'ENTREPRISE') as any
    try {
      return await this.prisma.user.create({
        data: { username: input.username, email: input.email, password: hashed, role: roleEnum, phone: input.phone, fullName: input.fullName, avatar: input.avatar },
        select: { id: true, username: true, email: true, fullName: true, phone: true, avatar: true, role: true, isActive: true, createdAt: true },
      })
    } catch (e: any) {
      throw new BadRequestException(e.message)
    }
  }

  async get(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id }, select: { id: true, username: true, email: true, fullName: true, phone: true, avatar: true, role: true, isActive: true, createdAt: true } })
    if (!user) throw new NotFoundException('Not found')
    return user
  }

  async update(id: number, input: any) {
    const data: any = { ...input }
    if (data.password) data.password = await bcrypt.hash(String(data.password), 10)
    if (data.role) data.role = data.role as any
    try {
      return await this.prisma.user.update({ where: { id }, data, select: { id: true, username: true, email: true, fullName: true, phone: true, avatar: true, role: true, isActive: true, createdAt: true } })
    } catch (e: any) {
      throw new BadRequestException(e.message)
    }
  }

  async remove(id: number) {
    await this.prisma.user.delete({ where: { id } })
  }
}
