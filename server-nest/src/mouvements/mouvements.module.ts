import { Module } from '@nestjs/common'
import { MouvementsController } from './mouvements.controller'
import { MouvementsService } from './mouvements.service'
import { PrismaService } from '../prisma.service'

@Module({
  controllers: [MouvementsController],
  providers: [MouvementsService, PrismaService],
})
export class MouvementsModule {}
