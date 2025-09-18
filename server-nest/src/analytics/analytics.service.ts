import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async summary(period?: string) {
    const entreprises = await this.prisma.entreprise.count()
    const totals = await this.prisma.mouvement.groupBy({ by: ['type'], _sum: { amount: true } })
    const credit = Number(totals.find(t => t.type === 'CREDIT')?._sum.amount || 0)
    const debitAbs = Math.abs(Number(totals.find(t => t.type === 'DEBIT')?._sum.amount || 0))
    const soldeNet = credit - debitAbs
    // naive growth placeholders
    const growthPercent = credit ? ((soldeNet / Math.max(credit, 1)) * 100) : 0
    const depensesGrowthPercent = 0
    const taxesDue = Math.round(debitAbs * 0.05)
    return { entreprises, revenusTotal: credit, depensesTotal: debitAbs, soldeNet, growthPercent, depensesGrowthPercent, taxesDue }
  }

  async monthly(months = 6) {
    const now = new Date()
    const start = new Date(now)
    start.setMonth(start.getMonth() - months)
    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT to_char(date_trunc('month', "createdAt"), 'YYYY-MM') as month,
             SUM("amount") as total
      FROM "Mouvement"
      WHERE "createdAt" >= $1
      GROUP BY 1
      ORDER BY 1
    `, start)
    return rows
  }

  async sector() {
    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT COALESCE("sector", 'Autres') as sector, SUM(CASE WHEN m."type"='CREDIT' THEN m."amount" ELSE 0 END) as revenus
      FROM "Entreprise" e
      LEFT JOIN "Mouvement" m ON m."entrepriseId" = e.id
      GROUP BY 1
      ORDER BY 2 DESC NULLS LAST
    `)
    return rows
  }

  async taxCompliance() {
    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT e.name,
             CASE WHEN MAX(m."createdAt") >= NOW() - INTERVAL '12 months' THEN 'À jour' ELSE 'En retard' END AS statut
      FROM "Entreprise" e
      LEFT JOIN "Mouvement" m ON m."entrepriseId" = e.id
      GROUP BY e.name
    `)
    return rows
  }

  async cashflow(weeks = 4) {
    const now = new Date()
    const start = new Date(now)
    start.setDate(start.getDate() - weeks * 7)
    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT to_char(date_trunc('week', "createdAt"), 'IYYY-IW') as week,
             SUM("amount") as total
      FROM "Mouvement"
      WHERE "createdAt" >= $1
      GROUP BY 1
      ORDER BY 1
    `, start)
    return rows
  }

  async topEnterprises() {
    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT e.name, SUM(m.amount) as revenus
      FROM "Entreprise" e
      JOIN "Mouvement" m ON m."entrepriseId" = e.id
      GROUP BY e.name
      ORDER BY revenus DESC
      LIMIT 5
    `)
    return rows
  }

  async alerts() {
    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT 
        CONCAT('ALR-', e.id) as id,
        CASE WHEN RANDOM() > 0.5 THEN 'Déclaration TVA' ELSE 'Rapport trimestriel' END as type,
        e.name as enterprise,
        (NOW() + (RANDOM() * INTERVAL '30 days')) as "dueDate",
        ABS(COALESCE(SUM(m.amount), 0))::numeric(15,2) as amount,
        CASE 
          WHEN RANDOM() > 0.7 THEN 'high'
          WHEN RANDOM() > 0.4 THEN 'medium'
          ELSE 'low'
        END as priority,
        CASE 
          WHEN RANDOM() > 0.7 THEN 'Urgent'
          WHEN RANDOM() > 0.4 THEN 'Attention'
          ELSE 'Info'
        END as status,
        EXTRACT(MONTH FROM (NOW() - COALESCE(MIN(m."createdAt"), NOW())))::int as "monthsSinceCreated"
      FROM "Entreprise" e
      LEFT JOIN "Mouvement" m ON m."entrepriseId" = e.id
      GROUP BY e.id, e.name
      ORDER BY amount DESC NULLS LAST
      LIMIT 8
    `)
    return rows
  }
}
