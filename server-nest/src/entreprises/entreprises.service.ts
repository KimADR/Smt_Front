import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { CreateEntrepriseDto, UpdateEntrepriseDto } from './dto/create-entreprise.dto'

@Injectable()
export class EntreprisesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.entreprise.findMany()
  }

  async create(input: CreateEntrepriseDto) {
    const data: any = {
      name: input.name,
      siret: input.siret,
      address: input.address,
      contactEmail: input.contactEmail,
      phone: input.phone,
      sector: input.sector,
      legalForm: input.legalForm,
      activity: input.activity,
      annualRevenue: input.annualRevenue !== undefined ? Number(input.annualRevenue) : undefined,
      city: input.city,
      postalCode: input.postalCode,
      description: input.description,
    }
    if (input.status) {
      data.status = input.status
    }
    if (input.taxType) data.taxType = input.taxType

    try {
      return await this.prisma.entreprise.create({ data })
    } catch (e: any) {
      throw new BadRequestException(e.message)
    }
  }

  async findOne(id: number) {
    const e = await this.prisma.entreprise.findUnique({ where: { id } })
    if (!e) throw new NotFoundException('Not found')
    return e
  }

  async update(id: number, input: UpdateEntrepriseDto) {
    const data: any = {}
    if (input.name !== undefined) data.name = input.name
    if (input.siret !== undefined) data.siret = input.siret
    if (input.address !== undefined) data.address = input.address
    if (input.contactEmail !== undefined) data.contactEmail = input.contactEmail
    if (input.phone !== undefined) data.phone = input.phone
    if (input.sector !== undefined) data.sector = input.sector
    if (input.annualRevenue !== undefined) data.annualRevenue = Number(input.annualRevenue)
    if (input.activity !== undefined) data.activity = input.activity
    if (input.city !== undefined) data.city = input.city
    if (input.postalCode !== undefined) data.postalCode = input.postalCode
    if (input.description !== undefined) data.description = input.description
    if (input.legalForm !== undefined) data.legalForm = input.legalForm
    if (input.status) {
      data.status = input.status
    }
    if (input.taxType) data.taxType = input.taxType

    try {
      return await this.prisma.entreprise.update({ where: { id }, data })
    } catch (e: any) {
      throw new BadRequestException(e.message)
    }
  }

  async remove(id: number) {
    await this.prisma.entreprise.delete({ where: { id } })
  }
}
