import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(from?: string, to?: string) {
    const where: any = {}
    if (from || to) {
      where.createdAt = {}
      if (from) where.createdAt.gte = new Date(from)
      if (to) where.createdAt.lte = new Date(to)
    }
    // naive: join mouvements and entreprises to build simple report rows
    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT m.id, e.name as entreprise, m."createdAt" as date, m.amount as amount, m.description as description
      FROM "Mouvement" m
      JOIN "Entreprise" e ON e.id = m."entrepriseId"
      WHERE ($1::timestamp IS NULL OR m."createdAt" >= $1)
        AND ($2::timestamp IS NULL OR m."createdAt" <= $2)
      ORDER BY m."createdAt" DESC
      LIMIT 200
    `, from ? new Date(from) : null, to ? new Date(to) : null)
    return rows
  }
}
