import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class MouvementsService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    return this.prisma.mouvement.findMany({
      select: { id: true, amount: true, type: true, description: true, createdAt: true, entrepriseId: true, userId: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async createFromBody(body: any) {
    const entrepriseId = Number(body.entrepriseId)
    if (!entrepriseId) throw new BadRequestException('entrepriseId requis')
    const exists = await this.prisma.entreprise.findUnique({ where: { id: entrepriseId } })
    if (!exists) throw new NotFoundException('Entreprise introuvable')
    const signType = String(body.type)
    const amountNum = Number(body.amount)
    if (!['CREDIT', 'DEBIT'].includes(signType)) throw new BadRequestException('type invalide')
    const amountSigned = signType === 'DEBIT' ? -Math.abs(amountNum) : Math.abs(amountNum)
    const created = await this.prisma.mouvement.create({ data: { entrepriseId, amount: amountSigned as any, type: signType as any, description: body.description } })
    return created
  }

  async createFromMultipart(rawBody: any) {
    let payload: any = {}
    try {
      payload = rawBody?.payload ? JSON.parse(String(rawBody.payload)) : {}
    } catch (e) {
      throw new BadRequestException('Invalid payload JSON')
    }
    const mapped = {
      entrepriseId: payload.entreprise_id ?? payload.entrepriseId,
      amount: payload.montant ?? payload.amount,
      type: (payload.type === 'RECETTE' || payload.type === 'CREDIT') ? 'CREDIT' : (payload.type === 'DEPENSE' || payload.type === 'DEBIT') ? 'DEBIT' : payload.type,
      description: payload.description,
    }
    return this.createFromBody({
      entrepriseId: mapped.entrepriseId,
      amount: mapped.type === 'DEBIT' ? -Math.abs(Number(mapped.amount)) : Math.abs(Number(mapped.amount)),
      type: mapped.type,
      description: mapped.description,
    })
  }
}
